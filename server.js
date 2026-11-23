// uzeg.mn — энгийн статик сайт (Node 24, build-гүй, Passenger-т тохирсон)
// Top-level await хэрэглэхгүй (Passenger require()-ээр ачаалдаг).
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 3100;            // Passenger өөрөө PORT өгнө
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type || 'text/plain; charset=utf-8' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return send(res, 400, 'Bad request');
  }

  // Хуучин хостын /api/... руу хандсан програм үлдсэн эсэхийг мэдэхийн тулд бүртгэнэ.
  if (urlPath.startsWith('/api/')) {
    console.log(`[API-хандалт] ${new Date().toISOString()} ${req.method} ${req.url} ` +
      `IP=${req.headers['x-forwarded-for'] || req.socket.remoteAddress} UA=${req.headers['user-agent'] || '-'}`);
    return send(res, 404, 'Not found');
  }

  if (urlPath.endsWith('/')) urlPath += 'index.html';

  const filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));
  if (!filePath.startsWith(PUBLIC_DIR + path.sep)) return send(res, 403, 'Forbidden');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return fs.readFile(path.join(PUBLIC_DIR, '404.html'), (e2, page) =>
        e2 ? send(res, 404, 'Not found') : send(res, 404, page, MIME['.html']));
    }
    const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    send(res, 200, data, type);
  });
});

server.listen(PORT, () => console.log(`uzeg.mn сайт ажиллаж байна: http://localhost:${PORT}`));
