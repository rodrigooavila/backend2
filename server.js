const http = require('http');
const url = require('url'); //permite resolver e fazer o parser de uma
const fs = require('fs'); //interação com sistemas de arquivos
const path = require('path'); //lidar com caminho de arquivos, extensões

const hostname = '127.0.0.1';
const port = 3000;

//media type, multipurpose internet mail extension é um padrão que indica a natureza e o formato
//de um arquivo.

const mimeTypes = {
    html: "text/html",
    css: "text/css",
    flow: "text/flow",
    js: "text/javascript",
    webmanifest: "text/webmanifest",
    png: "image/png",
    jpeg: "image/jpeg",
    jpg: "image/jpg",
    svg: "image/svg",
    woff: "font/woof",
    woff2: "font/woof2"
};

http.createServer((req, res) => {
    let acesso_uri = url.parse(req.url).pathname; //variavel que identifica os recursos acessados
    let caminho_completo_recurso = path.join(process.cwd(), decodeURI(acesso_uri)); //variavel com o caminho completo do recurso acessado
    console.log(caminho_completo_recurso);

    let recurso_carregado;
    try {
        recurso_carregado = fs.lstatSync(caminho_completo_recurso); //método que retorna o recurso acessado

    } catch (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404: Arquivo não encontrado!');
        res.end();
    }

    if (recurso_carregado.isFile()) { //verifica se é um arquivo
        let mimeType = mimeTypes[path.extname(caminho_completo_recurso).substring(1)]; //método que retorna o mimetype pela a extensão do arquivo

        res.writeHead(200, { 'Content-Type': mimeType });
        let fluxo_arquivo = fs.createReadStream(caminho_completo_recurso);
        fluxo_arquivo.pipe(res); //método que transmite o arquivo para o usuário
    } else if (recurso_carregado.isDirectory()) { //verifica se é um diretório
        res.writeHead(302, { 'Location': 'index.html' }); //busca o index no diretório
        res.end();

    } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('500: Erro interno do servidor!');
        res.end();
    }

}).listen(port, hostname, () => {
    console.log(`Server is running at https://${hostname}:${port}/`);
});