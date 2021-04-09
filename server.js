const express      = require('express')  
// const bodyParser   = require("body-parser")  
const morgan       = require('morgan')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi    = require('swagger-ui-express')
const moment       = require('moment')

const rotas = require('./routes/rotas')  

const app    = express()  
const multer = require('multer')
const path   = require('path')

const postSCCD                = require('./controllers/postSCCD')
const verifyTokenAD           = require('./auth/verifyTokenAD')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // error first callback
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {

        // error first callback
        //cb(null, `${file.fieldname}-${Date.now()}.${path.extname(file.originalname)}`);
        cb(null, file.originalname);
    }
});
const upload = multer({ storage })


app.use(express.static('public'))
app.use('/downloads',express.static('public'))

app.use('/sccd/uploads',express.static('uploads'))

///========================================================================

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
app.use(
    morgan(function (tokens, req, res) {
        return [
        moment().format(),'-',
        tokens['user-agent'](req, res),
        tokens['remote-addr'](req, res),'-',
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
        ].join(' ')
    })
)

app.use(function (req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*")  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")  
    res.header('Access-Control-Allow-Methods', 'POST, GET')  // PUT, POST, GET, DELETE, OPTIONS
    next()  
}) 

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}))

// parse application/json
app.use(express.json({limit:'4mb'}))

// Rotas
app.use('/api', rotas )  

// Servidor de documentação ( SWAGGER )
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,setupOptions))



// Uploads
app.post('/file/upload',verifyTokenAD , upload.single('file'), postSCCD )

// Serviço
const port = process.env.PORT || '5000'
const modo = process.env.NODE_ENV || 'Test'

app.listen(port, function () {
    console.log(moment().format(),`Servidor API - rodando na porta ${port} : Modo ${modo}`)
})