
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

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});

app.post('/add', (req, res) => {
  const newObject = req.body;
  //console.log(path.join(__dirname, 'public', 'json/jogadores.json'))
  const jsonFilePath = path.join(__dirname, 'public', 'json/jogadores.json');

  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo JSON.');
    }

    const jsonData = JSON.parse(data);
    
    //console.log(jsonData)
    let cont = 0
    if (jsonData.length >= 1) {
      for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].nome === newObject.nome) {
          console.log(jsonData[i].nome, newObject.nome)
          // jsonData.splice(i, 1);
          cont++
          break;
        }
      }
    }

    //console.log(cont)
    if (cont == 0) {
      jsonData.push(newObject);
    }
    
    fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Erro ao escrever no arquivo JSON.');
      }
      res.send('Objeto adicionado com sucesso!');
    });
  });
});

app.patch('/addPontuacao', (req, res) => {
  const newObject = req.body;
  const jsonFilePath = path.join(__dirname, 'public', 'json/jogadores.json');

  // Lendo o arquivo JSON
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo JSON.');
    }

    // Convertendo Json
    const jsonData = JSON.parse(data);

    const existingPlayerIndex = jsonData.findIndex(player => player.nome === newObject.nome);

    if (existingPlayerIndex !== -1) {
      jsonData[existingPlayerIndex].acertos = newObject.acertos;
      jsonData[existingPlayerIndex].tempo = newObject.tempo;
    } 
  
    fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Erro ao escrever no arquivo JSON.');
      }
      res.send(jsonData);
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
  //console.log('usuario conectado');
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
    socket.emit('conectado', nome);

    // json.push(JSON.stringify(jsonJogador))
  })
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
