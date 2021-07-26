const express                 = require('express')
const router                  = express.Router()

const faturacargas            = require('../consultas/faturaCargas')
const faturasTOTVS            = require('../controllers/faturasTOTVS')
const faturaERP               = require('../consultas/faturaERP')
const faturaERPdetalhe        = require('../consultas/faturaERPdetalhe')
const dae                     = require('../consultas/DAE')
const cartaFrete              = require('../consultas/cartaFrete')
const cartaFretePlacas        = require('../consultas/cartaFretePlacas')
const placasVeiculo           = require('../consultas/placasVeiculo')
const tabelaCliente           = require('../consultas/tabelaCliente')
const tabelaFretePeso         = require('../consultas/tabelaFretePeso')
const tabelaPercentualProduto = require('../consultas/tabelaPercentualProduto')
const tabelaFaixaPeso         = require('../consultas/tabelaFaixaPeso')
const tabelaColetaEntrega     = require('../consultas/tabelaColetaEntrega')
const apiCliente              = require('../consultas/apiCliente')
const apiTracking             = require('../consultas/apiTracking')
const posicaoCarga            = require('../controllers/posicaoCarga')
const dadosCTRC               = require('../controllers/dadosCTRC')
const documentoCTRC           = require('../controllers/documentoCTRC')
const dadosNF                 = require('../controllers/dadosNF')
const dadosLoteNF             = require('../controllers/dadosLoteNF')
const listaNFctrc             = require('../controllers/listaNFctrc')
const novosSCCD               = require('../controllers/novosSCCD')
const baixaSCCD               = require('../controllers/baixaSCCD')
const SCCDsuccess             = require('../controllers/SCCDsuccess')
const listaSCCD_ALB           = require('../controllers/listaSCCD_ALB')

const cteXML                  =require('../controllers/cteXML')
const login                   = require('../auth/login')
const loginAD                 = require('../auth/loginAD')
const logout                  = require('../auth/logout')
const validaToken             = require('../auth/verifyToken')
const verifyTokenAD           = require('../auth/verifyTokenAD')
const dadosCliente            = require('../consultas/dadosCliente')
const dadosFiliais            = require('../consultas/dadosFiliais')
const dadosCidadesAtendidas   = require('../consultas/dadosCidadesAtendidas')
const dadosCidadesAtendidasPOST = require('../consultas/dadosCidadesAtendidasPOST')
const stepTracker             = require('../consultas/stepTracker')
const posicaoCargaAPP         = require('../consultas/posicaoCargaAPP')
const listaDAE                = require('../consultas/listaDAE')
const senhaClienteEmail       = require('../consultas/senhaClienteEmail')
const posicaoCargaXLS         = require('../controllers/posicaoCargaXLS')
const posicaoCargaSTATUS      = require('../controllers/posicaoCargaSTATUS')
const listDadosCTRC           = require('../controllers/listDadosCTRC')

const getFotoID               = require('../controllers/getFotoID')
const firebaseToken           = require('../controllers/firebaseToken')
const produtosTransportados   = require('../consultas/produtosTransportados')
const listaFiliaisCliente     = require('../consultas/listaFiliaisCliente') 
const senhaCliente            = require('../controllers/senhaCliente') 
const checkImgSCCD            = require('../controllers/checkImgSCCD')
const receiveDataDebugAPP     = require('../controllers/receiveDataDebugAPP')
const fileNameCalcSCCD        = require('../controllers/fileNameCalcSCCD')
const downloadAgileProcess    = require('../controllers/downloadAgileProcess')

const apiPosicao = require('../consultas/apiPosicao')



/**
 * @swagger
 *
 * tags:
 * - name: "Acessos"
 * description: "Metódos da API para - Credênciais de acesso"
 */


/**
 * @swagger
 *
 * /login:
 *   post:
 *     tags:
 *     - "Acessos"
 *     description: Chamada da API para obter o Token de uso nos demais métodos 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: cnpj
 *         description: CNPJ ou CPF do cliente.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: senha
 *         description: Senha enviada para o Cliente para uso da API.
 *         in: formData
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Token com credênciais de acesso liberada
 *       401:
 *         description: Credenciais invalidas
 */
router.post('/login'   , login  )
router.post('/loginAD' , loginAD )

router.post('/senhacliente' , validaToken, senhaCliente )

router.post('/posicaocargaxls' , validaToken, posicaoCargaXLS)
router.get('/listDadosCTRC'    , validaToken, listDadosCTRC  )

router.post('/posicaocarga' , validaToken , posicaoCarga)
router.post('/dadosctrc'    , validaToken , dadosCTRC)
router.get('/documentoctrc' , validaToken , documentoCTRC)
router.post('/dadosnf'      , validaToken , dadosNF)
router.post('/dadoslotenf'  , validaToken , dadosLoteNF)
router.post('/listanfctrc'  , validaToken , listaNFctrc)

router.use('/ctexml'        , validaToken, cteXML )

router.get('/sccdfoto'       , getFotoID )
router.post('/checkimgsccd'  , checkImgSCCD)
router.post('/receiveDataDebugAPP'  , receiveDataDebugAPP)

router.get('/novossccd'        , novosSCCD )
router.post('/baixasccd'       , baixaSCCD )
router.post('/listasccdalb'    , listaSCCD_ALB )
router.post('/sccdsuccess'     , SCCDsuccess )
router.get('/fileNameCalcSCCD' , fileNameCalcSCCD)

// API ConfirmaFacil
router.get('/downloadAgileProcess' , downloadAgileProcess)

// APP Portfolio
router.use('/senhaclienteemail'      , senhaClienteEmail )
router.get('/steptracker'            , stepTracker )
router.get('/filiais'                , dadosFiliais )
router.get('/cidadesatentidas'       , dadosCidadesAtendidas )
router.post('/cidadesatentidaspost'  , dadosCidadesAtendidasPOST)
router.get('/posicaoCargastatus'     , posicaoCargaSTATUS)
router.get('/posicaocargaapp'        , validaToken, posicaoCargaAPP )
router.get('/listadae'               , validaToken, listaDAE )
router.get('/faturastotvs'           , validaToken, faturasTOTVS )
router.post('/firebasetoken'         , firebaseToken)
router.get('/produtostransportados'  , produtosTransportados)
router.get('/listafiliaiscliente'    , listaFiliaisCliente)


/**
 * @swagger
 *
 * /logout:
 *   get:
 *     tags:
 *     - "Acessos"
 *     description: Chamada para finalizar o uso da API
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
router.get('/logout'                , logout )

router.post('/apiPosicao'            ,validaToken, apiPosicao)

router.use('/apicliente'             , validaToken, apiCliente )
router.use('/apitracking'            , validaToken, apiTracking )
router.use('/faturaerp'              , validaToken, faturaERP )
router.use('/faturaerpdetalhe'       , validaToken, faturaERPdetalhe )

router.use('/dadoscliente'           , verifyTokenAD, dadosCliente )
router.use('/cartafrete'             , verifyTokenAD, cartaFrete )
router.use('/cartafreteplacas'       , verifyTokenAD, cartaFretePlacas )
router.use('/placasveiculo'          , verifyTokenAD, placasVeiculo )


router.use('/dae'                    , dae )
router.use('/faturacargas'           , faturacargas )
router.use('/tabelacliente'          , tabelaCliente )
router.use('/tabelafretepeso'        , tabelaFretePeso )
router.use('/tabelapercentualproduto', tabelaPercentualProduto )
router.use('/tabelafaixapeso'        , tabelaFaixaPeso )
router.use('/tabelacoletaentrega'    , tabelaColetaEntrega )


module.exports = router


/**
 * @swagger
 *
 * definitions:
 *  RetornoAPI:
 *    type: "object"
 *    properties:
 *      numero:
 *        type: "integer"
 *        format: "int64"
 *        description: "Numero do conhecimento"
 *      dataEmissao:
 *        type: "string"
 *        format: "date-time"
 *        description: "Data da emissão do documento"
 *      prevEntrega:
 *        type: "string"
 *        format: "date-time"
 *        description: "Data prevista para entrega"
 *      tipoPesoM3:
 *        type: "string"
 *        format: "string"
 *      pesoM3:
 *        type: "float"
 *        format: "numeric"
 *      valorMercadoria:
 *        type: "float"
 *        format: "numeric"
 *      chave:
 *        type: "string"
 *        format: "string"
 *      status:
 *        type: "string"
 *        description: "Order Status"
 *        enum:
 *        - "placed"
 *        - "approved"
 *        - "delivered"
 *      complete:
 *        type: "boolean"
 *        default: false
 */
