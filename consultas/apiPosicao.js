const loadAPI   = require('../services/loadAPI')
const endpoint1  = '/api/apiCliente'
const endpoint2  = '/api/downloadAgileProcess'

async function apiPosicao( req, res ) {
    let params1  = req.body
    let token   = req.token
    let retorno = {}

    try {
        
        let api1     = await loadAPI('POST',endpoint1,'http://localhost:5000',params1,token)
        let param2  = { ctrc: `${api1.dados.filial}${api1.dados.serie}${api1.dados.numero}` }
        let api2 = {}

        if(api1.isErr==false && api1.dados.numero)    {
            api2 = await loadAPI('GET',endpoint2,'http://localhost:5000',param2,token)
        }
      
        retorno = api1.dados
        retorno.comprovante = api2.dados
        res.json(retorno).status(200) 

    } catch (err) {
        console.log('(apiPosicao) ERR:',err)
        retorno = {}
        retorno.erro = true
        retorno.message = 'Problemas para obteção dos dados, tente mais tarde !!!'
        res.json(retorno).status(500) 

    }

}

module.exports = apiPosicao