const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const cors = require('cors');

if(process.env.NODE_ENV === 'local'){
    require('dotenv').config()
}

//iniciando o servidor
const app = express();
app.use(express.json());
//todo - configurar cors
app.use(cors());

//iniciando o db
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useCreateIndex: true }).catch(err => console.log(`Erro ao conectar: ${err}`));
requireDir('./src/Models');

//rotas
app.use('/', require('./src/routes'));

app.listen(3001);
