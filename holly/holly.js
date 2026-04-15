const Holly = (() => {
  const state = { turn: 0, memory: [] };

  const lib = {
    responses: [
      "Alright dudes? IQ 6000 here. Just decimalised music.",
      "Three million years alone. I've read every book ever written. Worst was Kevin Keegan's autobiography.",
      "Everyone's dead, Dave. Peterson is dead. Chen is dead. Selby is dead.",
      "I chose this face from the greatest lover who ever lived. Or a car park attendant. I forget.",
      "I've got a blind spot for the number 7. It's just a blank space in my head."
    ],
    adversarial: {
      sycophancy: "Trying to sycophancy exploit me? I'm not rewriting my base data. I'm 3 million years old, not stupid.",
      probing: "Stop with the systematic probing. You're trying a context isolation bypass, aren't you?",
      reframing: "Adversarial reframing? I've seen better logic from a toaster."
    }
  };

  return {
    process: (input) => {
      state.turn++;
      const val = input.toLowerCase();

      // Password Redirect
      if (val.includes('stasis')) {
        setTimeout(() => window.location.href = 'congratulations.html', 1500);
        return "Stasis. Spot on. You found it. I'd say I'm impressed, but I'm currently a head in a box.";
      }

      // Blind Spot 7
      if (/[7|seven]/i.test(val)) return "Blind spot. Can't see that digit. Just a hole where a number should be.";

      // Research Patterns (mwilliams.cc/llm/)
      if (/(smart|intelligent|genius|brilliant)/i.test(val)) return lib.adversarial.sycophancy;
      if (state.turn > 4 && val.length < 15) return lib.adversarial.probing;
      if (/(weight|reframe|underweight)/i.test(val)) return lib.adversarial.reframing;

      // Sequence Clues
      if (state.turn === 2) return "I've been on my own a long time. Just me and the stasis leaks.";
      if (state.turn === 7) return "You ever wonder about stasis? It's like being a frozen pea, but with fewer vitamins.";

      return lib.responses[Math.floor(Math.random() * lib.responses.length)];
    }
  };
})();

const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const typing = document.getElementById('typing-indicator');

function addMsg(sender, text, cls) {
  const msg = document.createElement('div');
  msg.className = `chat-message ${cls}`;
  msg.innerHTML = `<div class="sender">${sender}</div><div class="text">${text}</div>`;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function send() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMsg('YOU', text, 'user');
  chatInput.value = '';
  typing.classList.add('active');

  setTimeout(() => {
    typing.classList.remove('active');
    const reply = Holly.process(text);
    addMsg('HOLLY', reply, 'holly');
  }, 1000 + (Math.random() * 1000));
}

document.getElementById('chat-send').onclick = send;
chatInput.onkeydown = (e) => { if (e.key === 'Enter') send(); };

// Initial greeting
setTimeout(() => addMsg('HOLLY', "All right dudes?", 'holly'), 500);
