const express      = require('express')  
const bodyParser   = require("body-parser")  
const morgan       = require('morgan')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi    = require('swagger-ui-express')

const rotas = require('./routes/rotas')  

const app = express()  

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Documentação da API
const swaggerDefinition = {
    info: {
        title: 'API Termaco', 
        email: "ti@termaco.com.br",
        version: '0.0.1', 
        description: 'API Termaco para informações e acompanhamento das cargas pelos clientes',
      },
      host: process.env.SERVER+":"+process.env.PORT, 
      basePath: '/api',
}

// Localização das rotas e documentação
const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
}

const setupOptions = {
    swaggerOptions: {
        authAction :{ authentication: {name: "authentication", schema: {type: "apiKey", in: "header", name: "Authorization", description: ""}, value: "Bearer <JWT>"} }
      }
}

// Extrair a documentação dos aruivos *.js
const swaggerSpec = swaggerJSDoc(options)

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
app.use('/api', rotas )  

// Servidor de documentação ( SWAGGER )
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,setupOptions))


// Serviço
const port = process.env.PORT || '5000'
const modo = process.env.NODE_ENV || 'Test'

app.listen(port, function () {
    console.log(`Servidor rodando na porta ${port} : Modo ${modo}`)
})