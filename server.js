const express = require('express')  

const bodyParser = require("body-parser")  
const morgan = require('morgan')
const rotas = require('./routes/rotas')  

const app = express()  

// Log
app.use(morgan('dev'))

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

const port = process.env.PORT || '5000'
const modo = process.env.NODE_ENV || 'Test'

app.listen(port, function () {
    console.log(`Servidor rodando na porta ${port} : Modo ${modo}`)
})