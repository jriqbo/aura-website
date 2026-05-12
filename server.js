const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8000;
const directory = __dirname;

const rewrites = {
    '/corporativo': '/pages/corporativo.html',
    '/salud': '/pages/salud.html',
    '/turismo': '/pages/turismo.html',
    '/eventos': '/pages/eventos.html',
    '/aeropuerto': '/pages/aeropuerto.html',
    '/delivery': '/pages/delivery.html'
};

http.createServer((req, res) => {
    // Remove query strings and normalize trailing slashes
    let url = req.url.split('?')[0];
    if (url.length > 1 && url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    
    console.log(`[REQ] ${req.method} ${url}`);
    
    // Apply rewrites
    if (rewrites[url]) {
        console.log(`  -> Rewrite: ${url} to ${rewrites[url]}`);
        url = rewrites[url];
    } else if (url === '/') {
        url = '/index.html';
    }

    let filePath = path.join(directory, url);
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.webp': 'image/webp',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                console.log(`\x1b[31m  [404] Not Found: ${filePath}\x1b[0m`);
                res.writeHead(404);
                res.end('404: File not found - ' + url);
            } else {
                console.log(`\x1b[31m  [500] Error: ${error.code}\x1b[0m`);
                res.writeHead(500);
                res.end('500: Server Error - ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}).listen(port);

console.log(`\x1b[32m[AURA SERVER]\x1b[0m Running at http://localhost:${port}/`);
console.log(`\x1b[33m[REWRITES ACTIVE]\x1b[0m /salud, /corporativo, etc.`);
