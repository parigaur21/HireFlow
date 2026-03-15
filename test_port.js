const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Test server is running on 5001\n');
});

const PORT = 5001;
server.listen(PORT, '127.0.0.1', () => {
    console.log(`Test server running at http://127.0.0.1:${PORT}/`);
});

server.on('error', (err) => {
    console.error('SERVER ERROR:', err);
});
