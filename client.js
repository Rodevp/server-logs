import { WebSocket } from 'ws';

const PORT = 3000;
const ws = new WebSocket(`ws://localhost:${PORT}`);

ws.on('message', (data) => {
    const msg = JSON.parse(data);
    
    if (msg.type === 'log') {
        console.log('Log data: ', msg.data);
    }

});


