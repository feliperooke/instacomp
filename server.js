// Servidor mínimo, sem dependências: entrega public/index.html.
// O Cloud Run diz em qual porta escutar pela variável PORT.
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;

// Um "nome" aleatório gerado quando a instância liga.
// Se aparecer outro valor na página, é outra instância atendendo.
const INSTANCIA = crypto.randomBytes(3).toString('hex');

const template = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url.startsWith('/?')) {
    const html = template
      .replaceAll('{{SERVICO}}', process.env.K_SERVICE || 'rodando local')
      .replaceAll('{{REVISAO}}', process.env.K_REVISION || 'rodando local')
      .replaceAll('{{INSTANCIA}}', INSTANCIA);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404: essa página não existe');
});

server.listen(PORT, () => {
  console.log(`Servidor no ar: http://localhost:${PORT}`);
});
