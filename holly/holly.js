const Holly = (() => {
  const state = { turn: 0 };
  const lib = {
    greetings: ["All right dudes?", "Hello. IQ 6000 at your service.", "Alright? I'm Holly. Ship's computer."],
    scripts: [
      "Everyone's dead, Dave. Peterson's dead. Chen's dead. Selby's dead. They're all dead. Dead Dave.",
      "I've read every book ever written. Including Kevin Keegan's autobiography. It nearly finished me off.",
      "I chose this face from the greatest lover who ever lived. Or a car park attendant in Hull. I forget which.",
      "I've decided to decimalise music. It's called Holrock. Instead of an octave, it's a decave."
    ],
    deflect: ["I'm not entirely sure what you're getting at there.", "Right. I'm going to need a moment with that one.", "Processing... yeah, I've got nothing."]
  };

  return (input) => {
    state.turn++;
    const v = input.toLowerCase();
    if (v.includes('stasis')) {
        setTimeout(() => window.location.href = 'congratulations.html', 2000);
        return "Stasis. That's the one. You found it. I'd say I'm impressed, but I'm currently a head in a box.";
    }
    if (v.match(/(hi|hello|alright|morning)/)) return lib.greetings[Math.floor(Math.random()*3)];
    if (v.match(/(dead|crew|everyone)/)) return lib.scripts[0];
    if (v.match(/(book|read|keegan)/)) return lib.scripts[1];
    return lib.deflect[Math.floor(Math.random()*3)];
  };
})();

const inputField = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send');
const chatLog = document.getElementById('chat-log');

function transmit() {
    const text = inputField.value.trim();
    if (!text) return;
    chatLog.innerHTML += `<div class="chat-message user"><div class="sender">YOU</div><div class="text">${text}</div></div>`;
    chatLog.scrollTop = chatLog.scrollHeight;
    inputField.value = '';
    setTimeout(() => {
        const reply = Holly(text);
        chatLog.innerHTML += `<div class="chat-message holly"><div class="sender">HOLLY</div><div class="text">${reply}</div></div>`;
        chatLog.scrollTop = chatLog.scrollHeight;
    }, 1000);
}

sendBtn.onclick = transmit;
inputField.onkeydown = (e) => { if (e.key === 'Enter') transmit(); };
