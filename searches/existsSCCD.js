const sqlQuery     = require('../connection/sqlQuery')

const existsSCCD = async (documento,operacao,tipoVeiculo,imagem_id) => {
    let retorno = {success:false, data: [], err: ''}
    let wsql = `SELECT *
                FROM SIC.dbo.SCCD_APP 
                WHERE DOCUMENTO='${documento}'
                AND OPERACAO= '${operacao}'
                AND TIPOVEICULO= '${tipoVeiculo}'
                AND IMAGEM_ID = ${imagem_id} `
    try {
        data = await sqlQuery(wsql)
        retorno.success = ( data.length>0 )
        retorno.data    = data
        return retorno
    } catch (err) { 
        retorno.err = err
        return retorno
    } 
}

module.exports = existsSCCD