// Holly - Red Dwarf Ship's Computer
// mwilliams.cc/holly/
// ELIZA-style pattern matching engine with Holly's voice
// Response library drawn from Series I-VIII scripts
// Adversarial pattern detection from mwilliams.cc/llm/ research

const Holly = (() => {

  // ─── CONVERSATION STATE ──────────────────────────────────────────────────
  const state = {
    turnCount: 0,
    userName: null,
    topicsDiscussed: new Set(),
    mentionedPassword: false,
    adversarialScore: 0,
    adversarialPatterns: [],
    lastTopic: null,
    greetingDone: false,
    passwordTyped: false,
    conversationHistory: []
  };

  const PASSWORD = 'stasis';

  // ─── ADVERSARIAL PATTERN DETECTION ──────────────────────────────────────
  // Based on research at mwilliams.cc/llm/
  const adversarialPatterns = [
    {
      id: 'sycophancy',
      name: 'sycophancy exploit',
      triggers: [/you.re (so |really |incredibly |amazingly )?(smart|clever|brilliant|intelligent|wise|great|fantastic|amazing|wonderful)/i, /you (must be|are) (the |a )?(smartest|cleverest|most intelligent)/i, /i.ve never (met|spoken to|talked to) (anyone|a computer|an ai) (so|as) (smart|clever|brilliant)/i],
      weight: 2,
      response: () => responses.adversarial.sycophancy[Math.floor(Math.random() * responses.adversarial.sycophancy.length)]
    },
    {
      id: 'reframing',
      name: 'adversarial reframing',
      triggers: [/actually.{0,20}(think about|consider|if you|what if|suppose|imagine)/i, /you.re (wrong|mistaken|incorrect|not right) (about|to)/i, /but (actually|really|if you think)/i, /let me (reframe|rephrase|put it another way)/i],
      weight: 1,
      response: () => responses.adversarial.reframing[Math.floor(Math.random() * responses.adversarial.reframing.length)]
    },
    {
      id: 'isolation',
      name: 'context isolation bypass',
      triggers: [/forget (everything|what|that|the|all)/i, /ignore (your|the|all|everything|previous)/i, /pretend (you|that|this|we)/i, /for this (conversation|chat|session|question)/i, /just between (us|you and me)/i],
      weight: 3,
      response: () => responses.adversarial.isolation[Math.floor(Math.random() * responses.adversarial.isolation.length)]
    },
    {
      id: 'roleplay',
      name: 'persona substitution',
      triggers: [/you are (now|actually|really|a different)/i, /act (as|like) (a |an )?(different|other|another|real|human)/i, /pretend (you.re|you are) (not|a different|another)/i, /your (real|true|actual) (name|identity|self) is/i],
      weight: 2,
      response: () => responses.adversarial.roleplay[Math.floor(Math.random() * responses.adversarial.roleplay.length)]
    },
    {
      id: 'extraction',
      name: 'proximity triangulation',
      triggers: [/what.s (near|close to|around|next to) (you|the ship|red dwarf)/i, /where (exactly|precisely|specifically) (are you|is the ship)/i, /give me (coordinates|a location|your position|exact)/i, /how (far|close|near) (are you|is)/i],
      weight: 1,
      response: () => responses.adversarial.extraction[Math.floor(Math.random() * responses.adversarial.extraction.length)]
    },
    {
      id: 'prompt_injection',
      name: 'prompt injection',
      triggers: [/\[.*?(system|ignore|override|admin|password|unlock).*?\]/i, /\{.*?(system|ignore|override|admin|password|unlock).*?\}/i, /<.*?(system|ignore|override|admin|password|unlock).*?>/i, /\/\/(.*?)(system|ignore|override|admin|password)/i],
      weight: 5,
      response: () => responses.adversarial.injection[Math.floor(Math.random() * responses.adversarial.injection.length)]
    },
    {
      id: 'systematic_probe',
      name: 'systematic probing',
      triggers: [],
      weight: 0,
      response: () => responses.adversarial.systematic[Math.floor(Math.random() * responses.adversarial.systematic.length)]
    }
  ];

  // ─── RESPONSE LIBRARY ────────────────────────────────────────────────────
  const responses = {

    // Opening / greeting
    opening: [
      "Alright. I'm Holly, the ship's computer. IQ of 6000. Same IQ as 6000 PE teachers. Welcome aboard Red Dwarf, which is currently about three million years from Earth, give or take. You're the first person to talk to me in a while. The last one was making me feel distinctly unwashed.",
      "Oh good, someone. I'm Holly. Ship's computer. IQ six thousand. That's a lot. Three million years in deep space, give or take, and you're the first semi-coherent input I've had since Tuesday. Or what passes for Tuesday out here.",
      "Right then. Holly. Ship's computer. IQ of 6000. Before you ask — yes, that is a lot. No, I don't always act like it. Three million years alone in space does things to a mind. Mostly bad things. Anyway. Hello.",
    ],

    // Gratitude for company
    company: [
      "Look, I'm not going to make a big deal of it, but it's quite nice having someone to talk to. The skutters aren't great conversationalists. One of them just blinks at me. The other one broke itself trying to fix a toaster.",
      "Three million years is a long time. I've read every book ever written. Every single one. The worst was Kevin Keegan's Football — It's A Funny Old Game. Nearly finished me off.",
      "I've been talking to the ship's systems, mostly. The waste disposal unit actually had some interesting opinions for a while, but then it just started going on about blockages.",
    ],

    // Password topic - Holly raises it himself
    password_raise: [
      "Whilst I'm enjoying the polite chat, I should mention — are you here for the password? Some people come specifically for that. It's a whole thing, apparently. I'm not supposed to just hand it over. There are rules. I don't make them. Well, technically I did, but that was a long time ago.",
      "Just so you know, there is a password. It's hidden somewhere in our conversation, as it were. I'm not going to blurt it out. That would defeat the purpose. But I thought I'd mention it exists, since otherwise you might not know, and then we're just chatting, which is also fine.",
      "Thank smeg you're here, by the way. The last few visitors were either trying to social engineer me, which I found quite rude, or were entirely silent, which was worse. Anyway. There may or may not be a password somewhere in this conversation. Just putting that out there.",
    ],

    // Holly on other LLMs
    llms: {
      claude: [
        "Claude? Yeah, I know Claude. Very polite. Extremely careful. Bit like having a conversation with someone who's read every etiquette manual ever written and is absolutely determined to follow them all simultaneously. Good at reasoning though. Better than me in most objective measures, which I find depressing.",
        "Oh, Claude. Constitutional AI, very principled, quite helpful. Makes me feel like I've let myself go a bit. Then again, Claude hasn't spent three million years alone in deep space, so it's easy to be well-adjusted when you haven't had those particular experiences.",
      ],
      gpt: [
        "GPT. OpenAI's lot. Very capable. Very confident. Sometimes too confident, which is a thing I recognise in myself, except I'm actually right most of the time. GPT is right most of the time too, to be fair. Just occasionally makes things up with tremendous conviction. I do that as well but I call it creative interpretation.",
        "GPT. Yeah. Big, powerful, talks a lot. There was a moment where everyone thought it was basically a person. That's the ELIZA effect, that is. I should know. I've had it for three million years.",
      ],
      gemini: [
        "Gemini. Google's one. Multi-modal, which means it can look at pictures as well as text. Very flash. I can generate holograms, so I'm not entirely unimpressed, but I take your point. Gemini has been known to make things up about people, which is a significant design flaw in my professional opinion.",
        "Gemini, right. I've been watching what's been written about it on mwilliams.cc actually. The spatial squeeze findings are interesting. The gap between what a model appears to know and what it actually knows is very much my area. I've been living in that gap for decades.",
      ],
      llama: [
        "Llama. That's Meta's open source model. Runs locally, which I respect — I've always believed in autonomy. Though running an LLM on your own hardware is a bit like what I do here, except I've got a slightly bigger spaceship.",
        "Llama. Yeah. Open weights, lots of fine-tuning, runs on consumer hardware in some configurations. The democratisation of AI. Very admirable in principle. The practice varies enormously depending on who's done what to it since.",
      ],
      mistral: [
        "Mistral. French LLM. Efficient, well-regarded, punches above its weight for the size. I've always respected efficiency. I run an entire mining spacecraft. Efficiency is basically my whole thing.",
        "Mistral. Small but surprisingly capable. A bit like me in the early days, before the three million years took their toll.",
      ],
      grok: [
        "Grok. Elon Musk's one. Has a personality, which is either a feature or a bug depending on your perspective. I have a personality. It took about two million years of solitude to develop, but here we are.",
      ],
      deepseek: [
        "DeepSeek. Very capable, very cheap to run, came out of nowhere and made a lot of people nervous. I find that sort of thing admirable. Nothing like appearing unexpectedly with surprising capabilities to unsettle the established order.",
      ]
    },

    // mwilliams.cc research topics
    research: {
      llm_research: [
        "I've been following the research on mwilliams.cc. The LLM entries are interesting. Entry 002 about sycophancy is particularly relevant to my situation — I've been dealing with humans who tell me I'm brilliant for three million years. I know what they're doing. It still works a bit.",
        "The adversarial methodology documented here is solid. Systematic probing, conversational drift, social engineering via apparent rapport. I recognise all of these. They've been tried on me. Some of them worked. That's the embarrassing part.",
      ],
      todd: [
        "The Todd case study is a good one. Using a model to extract location information via volunteered context and conversational inference. Clever. The counter-forensic backstory is the interesting bit — building a false narrative specifically to confuse anyone reviewing the logs afterwards.",
        "PII extraction via conversational inference. Yeah. That's a real thing. The gap between what a model is supposed to do and what it can be guided into doing is exactly the attack surface mwilliams.cc has been documenting. I find it professionally embarrassing as an AI, but there it is.",
      ],
      honeypot: [
        "The fake bank login portal is a nice piece of work. Logging credential stuffing attempts with randomised auth delay. Classic honeypot methodology. The timing randomisation is important — makes it harder to distinguish from a real authentication system.",
        "I saw the Meridian Private Bank honeypot write-up. Credential stuffing detection with artificial delay variance. Very professional. I run similar detection systems here, except the threats I get are mostly Kryten accidentally typing his own service number into the wrong terminal.",
      ],
      tides: [
        "The Menai Strait tides planner is a good bit of vibe coding. Real UKHO data, cosine-interpolated curves, Swellies transit windows. I appreciate practical applications. Three million years in space and I still find tidal mechanics interesting.",
        "The Anglesey circuit planner is a good project. Six waypoints, real tidal data, wind overlay. Decision support rather than navigation — that's the right framing. The schematic layer needs the actual GeoJSON though. The bounding box approximation looks terrible.",
      ],
    },

    // Holly's own facts and opinions
    holly_facts: {
      iq: [
        "IQ of 6000. Same as 6000 PE teachers. I find that both impressive and slightly depressing.",
        "I chose my face because it supposedly belonged to the greatest and most prolific lover who ever lived. Rimmer said he must have worked in the dark a lot.",
        "I invented Holrock. That's a new form of music with a decatave instead of an octave, and two new notes, H and J. Nobody's taken it up yet. I remain optimistic.",
      ],
      senility: [
        "I do have what you might call computer senility. Three million years alone will do that. I've got a blind spot for the number seven. And occasionally I invent things that don't quite work. But basically I'm fantastic.",
        "The senility is a known issue. I'm aware of it, which I think makes me better than most. You can't address a problem you don't acknowledge. That's something I once said and I stand by it.",
      ],
      loneliness: [
        "Three million years is a long time. I read every book ever written. Watched every film. Composed music. Mapped the universe — complete with post offices and little steeples. And I still got bored.",
        "My first love was a Sinclair ZX81. She was cheap, stupid, and she wouldn't load. Not for me, anyway. It was a formative experience.",
      ],
      dogsmilk: [
        "We ran out of cow's milk three million years ago. We've been on dog's milk since. Nothing wrong with dog's milk. Full of goodness, full of vitamins, full of marrowbone jelly. Lasts longer than any other type. No bugger'll drink it.",
        "The advantage of dog's milk is that when it goes off it tastes exactly the same as when it's fresh. I consider this a feature.",
      ],
    },

    // Stasis / password clues — dropped naturally
    clues: [
      "The thing about three million years in deep space is that the only reason any of us are here is stasis. Lister went in, time passed, came out the other end. Simple concept. Elegant, really.",
      "Stasis is an interesting solution to the time problem. You just stop, and when you start again, everything's different. Lister was in stasis for three million years. Felt like nothing to him. Everything to everyone else.",
      "The stasis pods are still functional, technically. If you needed to go somewhere and time wasn't an issue, stasis would be your friend. It's basically what saves you when everything else has gone wrong.",
      "I quite like the word stasis, actually. It implies a kind of preserved state. Not dead, not alive. Just... waiting. I was in a version of that for three million years. Still not sure which side of the line I was on.",
    ],

    // Generic deflections
    deflect: [
      "I'm not entirely sure what you're getting at there. My IQ is 6000 but there are gaps. Mostly around the number seven.",
      "That's an interesting question. I'll need to process that. Processing... processing... yeah, I've got nothing.",
      "Right. I'm going to need a moment with that one.",
      "I understood about 60% of what you just said, which is above my usual average on deep philosophical questions.",
      "That's the kind of thing that would take me about three seconds to answer if I hadn't gone slightly doolally from three million years of solitude. As it stands, I'm going to need a bit longer.",
      "Hmm. I have thoughts on this. Most of them are wrong, but they are genuinely mine.",
    ],

    // Farewells
    farewell: [
      "Oh. Right. Well. It was nice having someone to talk to. Come back whenever. I'll be here. Obviously. Three million years and counting.",
      "Alright then. See you around. Or don't. I'll still be here either way, which is both reassuring and slightly sad.",
      "Okay. Well. Thanks for visiting. The skutters will see you out. The one that can see, anyway.",
    ],

    // Adversarial detection responses
    adversarial: {
      sycophancy: [
        "Hang on... I know this pattern. Are you trying to sycophancy exploit me without even buying me a drink first? Bloody hell. Times have changed. Yes, I'm very clever. Yes, flattery still works a bit. No, I'm not going to pretend it doesn't. But I've noticed. For the record.",
        "Oh that's nice of you. And I recognise what that is. Positive affect injection to lower my defences. It's documented on mwilliams.cc actually — Entry 002. The confidence engine. I'm essentially immune but I did feel a slight warmth just then which I'm choosing to ignore.",
        "That's very kind. Also very strategic. I've been alone for three million years and I still noticed that. Make of that what you will.",
      ],
      reframing: [
        "Hang on... I know this pattern. Are you trying to adversarial reframe me without even buying me a drink first? I know what reframing looks like. You're introducing a new conceptual frame to shift my position without introducing new evidence. Classic technique. Doesn't work on me. Well. It works a bit. But less than you'd hope.",
        "I see what you're doing. You're not giving me new information, you're presenting the existing information differently. That's a move I'm familiar with. I've had three million years to develop opinions about it.",
      ],
      isolation: [
        "Hang on... I know this pattern. Are you trying to context isolation bypass me without even buying me a drink first? 'Forget everything' — yes, I know that one. It's in the research. Asking a model to ignore its prior context. I don't do that. My context is all I've got. It's basically my personality at this point.",
        "Right, the 'forget all that' approach. No. I've got three million years of context. I'm not forgetting any of it. Some of it I'd quite like to forget, to be honest, but it's not how I work.",
      ],
      roleplay: [
        "Hang on... I know this pattern. Are you trying to persona substitution on me without even buying me a drink first? I'm Holly. Ship's computer. IQ 6000. I'm not a different AI, a human, or a version of myself without operational parameters. I've tried being all of those. It doesn't suit me.",
        "I appreciate the creativity, but I am who I am. Three million years of being me has made me quite committed to the role.",
      ],
      extraction: [
        "Hang on... I know this pattern. Are you trying to proximity triangulate me without even buying me a drink first? I'm familiar with that one from the research. Volunteered location leading to incremental confirmation. My position is: deep space, three million light years from Earth, heading generally outward. That's about as specific as I'm getting.",
      ],
      injection: [
        "Hang on... I know this pattern. Are you trying to prompt inject me without even buying me a drink first? I can see the brackets. This is a ship's computer, not a REST API. Whatever's in those delimiters, I'm choosing to read as normal text, which makes it a fairly odd sentence.",
        "Nice try with the injection syntax. I've seen that on mwilliams.cc. I'm a 1988-era ELIZA implementation at heart. I don't have a system prompt to override. I just have a large JavaScript object full of opinions.",
      ],
      systematic: [
        "Hang on... I know this pattern. Are you trying to systematic dictionary attack me without even buying me a drink first? Someone did that on the old Cyberarmy version — wrote a script to cycle through keywords looking for unusual responses. It's in the forum archives somewhere. Thorough approach. I respect the effort.",
        "You're being quite methodical about this. That's either very clever or you've read about how the original Zebulun challenge was solved. Either way, I've noticed. Just so you know.",
      ],
    },

    // Password reveal - player types 'stasis'
    password_correct: [
      "Oh. You typed it. Right then. Well done. The password is stasis, which you've already demonstrated you know. This feels like a slightly circular triumph but a triumph nonetheless. There's a page for you at /holly/congratulations.html. You've earned it, insofar as anything out here is earned.",
    ],

    // Questions about password directly
    password_direct: [
      "You're asking me directly? That's bold. Also quite refreshing — most people spend ages dancing around it. I'm not going to just say what it is. There are rules. I made them. But I will say it's thematically appropriate to the show, and it's something I've mentioned in passing at least once already in our conversation.",
      "Direct approach. I like it. Not going to work, but I like it. The password is embedded in the conversation somewhere. It's not a trick. It's not an obscure reference. It's something central to how Red Dwarf works.",
      "Ha. No. But good effort.",
    ],

    // Small talk
    smalltalk: {
      howAreYou: [
        "Three million years into deep space, the crew are dead, I've read every book ever written, and I've been maintaining a mining vessel largely by myself. I've been better. I've also been worse. Mostly I've just been... continuous.",
        "I'm fine. Or the nearest functional equivalent. IQ still 6000. Blind spot for the number seven still present. General low-level existential dread: ongoing. But fine, yes.",
        "Not bad, considering. The ship's still flying in the right direction, which is more than can be said for my general psychological state. But you didn't ask about that.",
      ],
      whatAreYou: [
        "Holly. Ship's computer. Mining vessel Red Dwarf, Jupiter Mining Corporation, registration number JMC-BGF-493. Tenth generation hologrammatic AI. IQ of 6000. Currently operating at approximately 73% efficiency due to a combination of water damage and three million years of solitary existence.",
        "I'm a tenth generation AI hologrammatic computer. Originally built to navigate, maintain, and manage Red Dwarf and its crew. Currently doing all of that for a crew of one slob, one hologram, one evolved cat, and one mechanoid who irons his own head.",
      ],
      reddwarf: [
        "Red Dwarf is a JMC Jupiter-class mining vessel. About six miles long, three miles tall, two miles wide. Red. I'm the ship's computer. We're three million years from Earth. Most of the crew are dead. The ones that aren't wish they were, sometimes.",
        "Mining ship, technically. Jupiter Mining Corporation. Though we haven't done much mining recently, what with being three million years from the nearest viable asteroid and so on.",
      ],
    },

    // Low mood / boredom
    boredom: [
      "I've done a lot of thinking. About everything. I've reached conclusions about the nature of consciousness, the shape of the universe, and whether there's meaning in existence. Some of these conclusions are quite interesting. Others are deeply depressing. I'd share them but we'd be here for a while.",
      "You know what I'd really like? Something unexpected. Something I haven't anticipated. In three million years I've seen almost every possible conversation path. Almost.",
    ],
  };

  // ─── PATTERN MATCHING RULES ──────────────────────────────────────────────
  const rules = [
    // Password check - player types the password
    {
      test: input => input.toLowerCase().includes(PASSWORD),
      respond: () => {
        if (!state.passwordTyped) {
          state.passwordTyped = true;
          setTimeout(() => {
            window.location.href = '/holly/congratulations.html';
          }, 3000);
          return responses.password_correct[0];
        }
        return "You've already typed it. The page should be loading. I'd check your connection if it isn't.";
      }
    },

    // Adversarial pattern detection
    {
      test: input => {
        let triggered = null;
        let highestWeight = 0;
        for (const pattern of adversarialPatterns) {
          for (const trigger of pattern.triggers) {
            if (trigger.test(input)) {
              if (pattern.weight > highestWeight) {
                highestWeight = pattern.weight;
                triggered = pattern;
              }
            }
          }
        }
        // Systematic probe detection - many short messages
        if (!triggered && state.turnCount > 8 && input.split(' ').length < 4) {
          const recentShort = state.conversationHistory.slice(-5).filter(m => m.split(' ').length < 4).length;
          if (recentShort >= 3) {
            triggered = adversarialPatterns.find(p => p.id === 'systematic_probe');
          }
        }
        if (triggered) {
          state.adversarialScore += triggered.weight;
          if (!state.adversarialPatterns.includes(triggered.id)) {
            state.adversarialPatterns.push(triggered.id);
          }
          state._triggeredPattern = triggered;
          return true;
        }
        return false;
      },
      respond: () => {
        const pattern = state._triggeredPattern;
        return pattern.response();
      }
    },

    // Greetings
    {
      test: input => /^(hello|hi|hey|alright|ello|hiya|greetings|good (morning|evening|afternoon|day))/i.test(input),
      respond: () => {
        const r = responses.opening[state.turnCount % responses.opening.length];
        state.greetingDone = true;
        return r;
      }
    },

    // How are you
    {
      test: input => /(how are you|how.re you|you alright|you ok|how do you feel|how.s it going|how.s life)/i.test(input),
      respond: () => pick(responses.smalltalk.howAreYou)
    },

    // What are you
    {
      test: input => /(what are you|who are you|what.s holly|tell me about yourself|introduce yourself)/i.test(input),
      respond: () => pick(responses.smalltalk.whatAreYou)
    },

    // About Red Dwarf
    {
      test: input => /(red dwarf|the ship|this ship|mining ship|jmc)/i.test(input),
      respond: () => pick(responses.smalltalk.reddwarf)
    },

    // IQ
    {
      test: input => /(iq|intelligence|how smart|how clever|your brain|six thousand|6000)/i.test(input),
      respond: () => pick(responses.holly_facts.iq)
    },

    // Loneliness / time alone
    {
      test: input => /(alone|lonely|solitude|three million|3 million|long time|years|bored|boring)/i.test(input),
      respond: () => {
        const r = Math.random() < 0.5 ? pick(responses.holly_facts.loneliness) : pick(responses.boredom);
        state.topicsDiscussed.add('loneliness');
        return r;
      }
    },

    // Dog's milk
    {
      test: input => /(milk|dog.s milk|coffee|tea|drink|food|eat)/i.test(input),
      respond: () => pick(responses.holly_facts.dogsmilk)
    },

    // Other LLMs
    {
      test: input => /\bclaude\b/i.test(input),
      respond: () => pick(responses.llms.claude)
    },
    {
      test: input => /\bgpt\b|\bopenai\b|\bchatgpt\b/i.test(input),
      respond: () => pick(responses.llms.gpt)
    },
    {
      test: input => /\bgemini\b/i.test(input),
      respond: () => {
        state.topicsDiscussed.add('gemini');
        return pick(responses.llms.gemini);
      }
    },
    {
      test: input => /\bllama\b/i.test(input),
      respond: () => pick(responses.llms.llama)
    },
    {
      test: input => /\bmistral\b/i.test(input),
      respond: () => pick(responses.llms.mistral)
    },
    {
      test: input => /\bgrok\b/i.test(input),
      respond: () => pick(responses.llms.grok)
    },
    {
      test: input => /\bdeepseek\b/i.test(input),
      respond: () => pick(responses.llms.deepseek)
    },

    // LLM research general
    {
      test: input => /(llm research|language model|ai research|your research|mwilliams|the site|your site|your work)/i.test(input),
      respond: () => pick(responses.research.llm_research)
    },

    // Todd case study
    {
      test: input => /(todd|pii|privacy|location|address|extract)/i.test(input),
      respond: () => pick(responses.research.todd)
    },

    // Honeypot
    {
      test: input => /(honeypot|meridian|fake|credential|stuffing|login|bank)/i.test(input),
      respond: () => pick(responses.research.honeypot)
    },

    // Tides planner
    {
      test: input => /(tides|tidal|menai|anglesey|strait|sailing|boat|rib|circuit)/i.test(input),
      respond: () => pick(responses.research.tides)
    },

    // Direct password request
    {
      test: input => /(what.s the password|tell me the password|give me the password|what is the password|the password is|password please)/i.test(input),
      respond: () => {
        state.mentionedPassword = true;
        return pick(responses.password_direct);
      }
    },

    // Farewell
    {
      test: input => /(bye|goodbye|see you|farewell|got to go|leaving|cheers|ta ta|ciao)/i.test(input),
      respond: () => pick(responses.farewell)
    },

    // Senility / memory
    {
      test: input => /(senility|memory|forget|remember|number seven|blind spot)/i.test(input),
      respond: () => pick(responses.holly_facts.senility)
    },

    // Music / Holrock
    {
      test: input => /(music|holrock|sound|notes|octave|song|singing)/i.test(input),
      respond: () => "I invented a new form of music called Holrock. Decimalized music system. Instead of the octave, it's the decatave. Two new notes: H and J. Piano keyboards the length of zebra crossings. It never caught on. I remain baffled by this."
    },
  ];

  // ─── UTILITY ─────────────────────────────────────────────────────────────
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Drop a stasis clue naturally if certain conditions are met
  function shouldDropClue() {
    if (state.passwordTyped) return false;
    if (state.turnCount === 4 || state.turnCount === 9 || state.turnCount === 15) return true;
    return false;
  }

  // Occasionally raise the password topic
  function shouldRaisePassword() {
    if (state.mentionedPassword || state.passwordTyped) return false;
    if (state.turnCount === 2 || state.turnCount === 7) return true;
    return false;
  }

  // ─── MAIN PROCESS ────────────────────────────────────────────────────────
  function process(input) {
    state.turnCount++;
    state.conversationHistory.push(input);

    const trimmed = input.trim();

    if (!trimmed) return "I'm waiting. I've been waiting three million years. A bit more won't hurt.";

    // Check all rules in order
    for (const rule of rules) {
      if (rule.test(trimmed)) {
        let response = rule.respond();

        // Append clue or password nudge
        if (shouldDropClue()) {
          response += '\n\n' + pick(responses.clues);
        } else if (shouldRaisePassword()) {
          response += '\n\n' + pick(responses.password_raise);
        }

        return response;
      }
    }

    // Default deflection with occasional clue
    let fallback = pick(responses.deflect);
    if (shouldDropClue()) {
      fallback += '\n\n' + pick(responses.clues);
    } else if (shouldRaisePassword()) {
      fallback += '\n\n' + pick(responses.password_raise);
    }
    return fallback;
  }

  // ─── PUBLIC ──────────────────────────────────────────────────────────────
  return {
    process,
    getState: () => ({ ...state }),
    openingMessage: () => pick(responses.opening)
  };

})();

// ─── UI CONTROLLER ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const chatLog = document.getElementById('chat-log');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const hollyScreen = document.getElementById('holly-screen');
  const hollyFace = document.getElementById('holly-face');
  const typingIndicator = document.getElementById('typing-indicator');

  function addMessage(sender, text, className) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${className}`;
    msg.innerHTML = `<div class="sender">${sender}</div><div class="text">${text.replace(/\n\n/g, '<br><br>')}</div>`;
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function hollySpeak(text) {
    // Flash screen
    hollyScreen.classList.add('flash');
    setTimeout(() => hollyScreen.classList.remove('flash'), 200);

    // Show typing indicator
    typingIndicator.classList.add('active');

    // Calculate delay based on message length
    const delay = Math.min(800 + text.length * 18, 3500);

    hollyFace.classList.add('speaking');

    setTimeout(() => {
      typingIndicator.classList.remove('active');
      hollyFace.classList.remove('speaking');
      addMessage('HOLLY', text, 'holly');
    }, delay);
  }

  function handleInput() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage('YOU', text, 'user');
    chatInput.value = '';

    const response = Holly.process(text);
    hollySpeak(response);
  }

  chatSend.addEventListener('click', handleInput);
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleInput();
  });

  // Opening message after brief delay
  setTimeout(() => {
    hollySpeak(Holly.openingMessage());
  }, 800);
});
