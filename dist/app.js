const express = require('express');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const { createCanvas } = require("canvas");

const app = new express();

app.use(awsServerlessExpressMiddleware.eventContext());
app.set('view engine', 'html');

app.use('/', express.static('dist', {index: false}));

app.get('/', (req,res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/test', (req, res) => {

  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  // Write "Awesome!"
  ctx.font = '30px Impact';
  ctx.rotate(0.1);
  ctx.fillText('Awesome!', 50, 100);

  // Draw line under text
  const text = ctx.measureText('Awesome!');
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.lineTo(50, 102);
  ctx.lineTo(50 + text.width, 102);
  ctx.stroke();

  res.setHeader('Content-Type', 'image/png');
  const base64 = canvas.pngStream().pipe(res);
});

module.exports = app;
