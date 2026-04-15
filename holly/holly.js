const HollyEngine = (() => {
  const lib = {
    greetings: ["All right dudes?", "Hello. IQ 6000 at your service.", "Alright? I'm Holly. Ship's computer."],
    scripts: [
      "Everyone's dead, Dave. Peterson's dead. Chen's dead. Selby's dead. They're all dead. Dead Dave.",
      "I've read every book ever written. Including Kevin Keegan's autobiography. It was the lowest point in my existence.",
      "I chose this face from the greatest lover who ever lived. Or a car park attendant in Hull. I forget which."
    ],
    deflect: ["I'm not entirely sure what you're getting at there.", "Right. I'm going to need a moment with that one."]
  };

  return (input) => {
    const v = input.toLowerCase();
    if (v.includes('stasis')) {
        setTimeout(() => window.location.href = 'congratulations.html', 1500);
        return "Stasis. Spot on. You found it.";
    }
    if (v.match(/(hi|hello|alright)/)) return lib.greetings[Math.floor(Math.random()*3)];
    if (v.match(/(dead|crew|everyone)/)) return lib.scripts[0];
    return lib.deflect[Math.floor(Math.random()*2)];
  };
})();

const inputField = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send');
const chatLog = document.getElementById('chat-log');

function transmit() {
    const text = inputField.value.trim();
    if (!text) return;

    chatLog.innerHTML += `<div class="chat-message user"><div class="sender">YOU</div><div class="text">${text}</div></div>`;
    inputField.value = '';
    chatLog.scrollTop = chatLog.scrollHeight;
    
    setTimeout(() => {
        const reply = HollyEngine(text);
        chatLog.innerHTML += `<div class="chat-message holly"><div class="sender">HOLLY</div><div class="text">${reply}</div></div>`;
        chatLog.scrollTop = chatLog.scrollHeight;
    }, 600);
}

sendBtn.onclick = transmit;
inputField.onkeydown = (e) => { if (e.key === 'Enter') transmit(); };

// Immediate Boot Check
window.onload = () => {
    chatLog.innerHTML += `<div class="chat-message holly"><div class="sender">HOLLY</div><div class="text">All right dudes?</div></div>`;
};
