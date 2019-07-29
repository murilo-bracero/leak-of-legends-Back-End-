const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const cors = require('cors');

//iniciando o servidor
const app = express();
app.use(express.json());
//todo - configurar cors
app.use(cors());

//iniciando o db
mongoose.connect('mongodb+srv://admin:admin@leak-of-legends-kmcv7.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true, useCreateIndex: true }).catch(err => console.log(`Erro ao conectar: ${err}`));
requireDir('./src/Models');

//rotas
app.use('/', require('./src/routes'));

app.listen(3001);