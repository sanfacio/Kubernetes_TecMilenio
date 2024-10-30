const express = require('express');
const app = express();
const port = 3100;

// Ruta simple que genera una carga de CPU
app.get('/', (req, res) => {
  res.send('Hello, World! This is our first monitoring app in Node.js');
});

// Ruta que simula carga de CPU
app.get('/load', (req, res) => {
  let result = 0;
  for (let i = 0; i < 1e8; i++) {
    result += i;
  }
  res.send(`CPU load result: ${result}`);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
