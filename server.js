// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let players = [];

wss.on('connection', (ws) => {
  const player = { id: players.length, x: 0, y: 0 };
  players.push(player);

  ws.on('message', (msg) => {
    const input = JSON.parse(msg);
    if (input.key === 'ArrowRight') player.x += 1;
    if (input.key === 'ArrowLeft') player.x -= 1;
  });

  const interval = setInterval(() => {
    ws.send(JSON.stringify({ players }));
  }, 50);

  ws.on('close', () => clearInterval(interval));
});
