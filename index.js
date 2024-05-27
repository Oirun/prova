
const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'view')));


// Middleware para analisar o corpo das requisições como JSON
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log(__dirname + '/view/index.html')
  res.sendFile(__dirname + '/view/index.html');
});

app.post('/add', (req, res) => {
  const newObject = req.body;
  console.log(path.join(__dirname, 'public', 'json/jogadores.json'))
  // Caminho do arquivo JSON
  const jsonFilePath = path.join(__dirname, 'public', 'json/jogadores.json');

  // Lendo o arquivo JSON existente
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo JSON.');
    }

    // Parseando o conteúdo JSON existente
    const jsonData = JSON.parse(data);
    // Adicionando o novo objeto ao array
    
    console.log(jsonData.length)
    if (jsonData.length > 1) {
      for (let i = 0; i < jsonData.length; i++) {
        console.log(jsonData[i].nome, newObject.nome)
        if (jsonData[i].nome === newObject.nome) {
          jsonData.splice(i, 1);
          break;
        }
      }
    }
    jsonData.push(newObject);
    // Escrevendo de volta ao arquivo JSON
    fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Erro ao escrever no arquivo JSON.');
      }
      res.send('Objeto adicionado com sucesso!');
    });
  });
});

app.get('/data', (req, res) => {
  const jsonFilePath = path.join(__dirname, 'public', 'json/jogadores.json');

  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo JSON.');
    }
    res.json(JSON.parse(data));
  });
});

app.get('/perguntas', (req, res) => {
  const jsonFilePath = path.join(__dirname, 'public', 'json/perguntas.json');

  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo JSON.');
    }
    res.json(JSON.parse(data));
  });
});

app.get('/sair', (req, res) => {
  
  res.redirect('/');
});

io.on('connection', (socket) => {
  console.log('usuario conectado');
  socket.on('disconnection', () => {
    io.emit('disconnect')
  })
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });

io.on('connection', (socket) => {
  socket.broadcast.emit('hi');
});

io.on('connection', (socket) => {
  socket.on('conectado', (nome) => {
    io.emit('conectado', nome);

    // json.push(JSON.stringify(jsonJogador))
  })
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
