const formataDataSQL = require('../helpers/formataDataSQL')

const sccd_db = async ( mobile ) => {
    return {
        TIPO: 'CARTAFRETE',
        DOCUMENTO: mobile.data.cartaFrete,
        DT_UPLOAD: formataDataSQL(mobile.data.date),
        MOTORISTA: mobile.data.motorista,
        PLACAS: mobile.data.placas,
        OBS: mobile.data.observacao,
        OPERACAO: mobile.data.operacao,
        TIPOVEICULO: mobile.data.tipoVeiculo,
        ARQUIVO: mobile.data.fileName,
        IMAGEM_ID: mobile.data.id,
        USUARIO: mobile.user,
        MATRICULA: mobile.matricula
    }
}

module.exports = sccd_db