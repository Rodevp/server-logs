import express from 'express';
import { WebSocketServer } from "ws";

const PORT = 3000;
const app = express();

app.use(express.json());

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

const LOGS_DATA = [];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/logs', (req, res) => {
    res.status(200).json(LOGS_DATA);
});

app.post('/log', (req, res) => {
    const { message, sender, error } = req.body;

    LOGS_DATA.push({
        message,
        sender,
        error,
        timestamp: new Date().toISOString()
    });

    wss.emit('log', LOGS_DATA);

    res.status(201).json({
        message: 'Log entry created successfully',
    });

});

wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
});

wss.on('log', (logs) => {
    console.log('Broadcasting logs to all clients:', logs);
    wss.clients.forEach((client) => {
        client.send(JSON.stringify({ type: 'log', data: logs }));
    })
});

wss.on('close', () => {
    console.log('WebSocket connection closed');
});


