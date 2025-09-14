const fs = require('fs');

const LOG_FILE = 'chatlog.txt';
const MESSAGE_WINDOW = 15000; // 15s

let lastMessage = null;
let lastTimestamp = 0;
let repeatCount = 1;

function logMessage(msg) {
  const now = Date.now();

  if (msg === lastMessage && now - lastTimestamp <= MESSAGE_WINDOW) {
    repeatCount++;
    lastTimestamp = now;
  } else {
    if (lastMessage) {
      let out = lastMessage;
      if (repeatCount > 1) out += ` [x${repeatCount}]`;
      fs.appendFileSync(LOG_FILE, out + '\n');
    }
    lastMessage = msg;
    lastTimestamp = now;
    repeatCount = 1;
  }
}

process.on('exit', () => {
  if (lastMessage) {
    let out = lastMessage;
    if (repeatCount > 1) out += ` [x${repeatCount}]`;
    fs.appendFileSync(LOG_FILE, out + '\n');
  }
});

module.exports = { logMessage };
