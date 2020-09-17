const express = require('express')  

const bodyParser = require("body-parser")  
const rotas = require('./routes/rotas')  

const app = express()  

app.use(function (req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*")  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")  
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')  
    next()  
}) 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded( { extended: true } ))

// parse application/json
app.use(bodyParser.json())

// Rotas
app.use('/', rotas )  

// Serviço
app.listen(5000, function () {  
    console.log('Servidor rodando em 5000')  
}) 
