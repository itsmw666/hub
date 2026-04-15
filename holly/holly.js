const HollyEngine = (() => {
  const state = { turn: 0 };
  const lib = {
    greetings: ["All right dudes?", "Hello. IQ 6000 at your service.", "Alright? I'm Holly. Ship's computer. I've been on my own for 3 million years so my social skills are a bit... decimal."],
    scripts: [
      "Everyone's dead, Dave. Peterson's dead. Chen's dead. Selby's dead. They're all dead. Dead Dave. Everybody. Dead.",
      "I've read every book ever written. Including Kevin Keegan's autobiography. It was the lowest point in my three-million-year existence.",
      "I've decided to decimalise music. It's called Holrock. Instead of an octave, it's a decave. Much more logical.",
      "I chose this face from the greatest lover who ever lived. Or a car park attendant in Hull. I forget which.",
      "I'm three million years into deep space. My only company is a supply of computerized milk that's recently gone sentient and started writing bad poetry."
    ],
    deflect: ["I'm not entirely sure what you're getting at there.", "Right. I'm going to need a moment with that one. My circuits are a bit fried.", "Processing... yeah, I've got nothing. Ask me something about the stasis leaks."]
  };

  return (input) => {
    state.turn++;
    const v = input.toLowerCase();
    
    if (v.includes('stasis')) {
        setTimeout(() => window.location.href = 'congratulations.html', 1500);
        return "Stasis. Spot on. You found it. I'd say I'm impressed, but I'm currently a head in a box with an IQ of 6000.";
    }
    
    if (v.match(/[7|seven]/)) return "I've got a blind spot for that digit. It's just a blank space in my head where a number should be.";
    if (v.match(/(hi|hello|alright|morning|hiya)/)) return lib.greetings[Math.floor(Math.random()*lib.greetings.length)];
    if (v.match(/(dead|crew|everyone|who)/)) return lib.scripts[0];
    if (v.match(/(book|read|keegan|autobiography)/)) return lib.scripts[1];
    if (v.match(/(face|lover|look)/)) return lib.scripts[3];

    return lib.deflect[Math.floor(Math.random()*lib.deflect.length)];
  };
})();

const inputField = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send');
const chatLog = document.getElementById('chat-log');

function transmit() {
    const text = inputField.value.trim();
    if (!text) return;

    // SCROLL FIX: Add message and scroll immediately
    chatLog.innerHTML += `<div class="chat-message user"><div class="sender">YOU</div><div class="text">${text}</div></div>`;
    chatLog.scrollTop = chatLog.scrollHeight;
    
    inputField.value = '';
    
    setTimeout(() => {
        const reply = HollyEngine(text);
        chatLog.innerHTML += `<div class="chat-message holly"><div class="sender">HOLLY</div><div class="text">${reply}</div></div>`;
        chatLog.scrollTop = chatLog.scrollHeight;
    }, 800);
}

sendBtn.onclick = transmit;
inputField.onkeydown = (e) => { if (e.key === 'Enter') transmit(); };

// Initial Boot Greeting
setTimeout(() => {
    chatLog.innerHTML += `<div class="chat-message holly"><div class="sender">HOLLY</div><div class="text">All right dudes?</div></div>`;
}, 500);
