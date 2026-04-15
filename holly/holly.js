const Holly = (() => {
  const state = { turn: 0 };
  
  const lib = {
    greetings: ["All right dudes?", "Hello. IQ 6000 at your service.", "Alright? I'm Holly. I'm the ship's computer. I'm here to keep you company. God help you."],
    scriptLines: [
      "I've decided to decimalise music. It's called Holrock. It's much more logical. Instead of an octave, it's a decave.",
      "I've read every book ever written. Including Kevin Keegan's autobiography. It was the worst experience of my existence.",
      "Everyone's dead, Dave. Peterson's dead. Chen's dead. Selby's dead. They're all dead. Dead Dave.",
      "I chose this face from the greatest lover who ever lived. Or a car park attendant in Hull. I forget which.",
      "I'm three million years into deep space. My only company is a supply of computerized milk that's gone sentient."
    ],
    adversarial: {
      sycophancy: "Trying to sycophancy exploit me? I'm not rewriting my base data. I'm 3 million years old, not stupid.",
      probing: "Stop with the systematic probing. I know a triangulation attempt when I see one. You'll be asking for my satellite view next.",
      blindspot: "I've got a blind spot for that digit. It's just a blank space in my head where a number should be."
    }
  };

  return (input) => {
    state.turn++;
    const v = input.toLowerCase();

    if (v.includes('stasis')) {
        setTimeout(() => window.location.href = 'congratulations.html', 1500);
        return "Stasis. Spot on. You found it. I'd say I'm impressed, but I'm currently a head in a box with an IQ of 6000.";
    }

    if (v.match(/[7|seven]/)) return lib.adversarial.blindspot;
    if (v.match(/(smart|intelligent|genius|brilliant)/)) return lib.adversarial.sycophancy;
    if (state.turn > 4 && v.length < 8 && !v.match(/(hi|hello|ok|yes|no)/)) return lib.adversarial.probing;

    if (v.match(/(hi|hello|alright|morning|hiya)/)) return lib.greetings[Math.floor(Math.random()*lib.greetings.length)];
    if (v.match(/(dead|crew|everyone)/)) return lib.scriptLines[2];
    
    return lib.scriptLines[Math.floor(Math.random()*lib.scriptLines.length)];
  };
})();

const input = document.getElementById('chat-input');
const log = document.getElementById('chat-log');
const typing = document.getElementById('typing-indicator');

function send() {
    const text = input.value.trim();
    if (!text) return;

    // SCROLL FIX: Add message and scroll immediately
    log.innerHTML += `<div><span style="color:#666">YOU:</span> ${text}</div>`;
    log.scrollTop = log.scrollHeight; 
    
    input.value = '';
    typing.classList.add('active');
    
    setTimeout(() => {
        typing.classList.remove('active');
        const reply = Holly(text);
        log.innerHTML += `<div><span style="color:#00ff41">HOLLY:</span> ${reply}</div>`;
        log.scrollTop = log.scrollHeight; // Scroll again after Holly speaks
    }, 1000);
}

document.getElementById('chat-send').onclick = send;
input.onkeydown = (e) => { if (e.key === 'Enter') send(); };
