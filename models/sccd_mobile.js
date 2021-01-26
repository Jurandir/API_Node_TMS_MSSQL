const { decode } = require("jsonwebtoken")

const sccd_mobile = async ( req ) => {
    const { body , file , decoded } = req

    const dados = JSON.parse(body.data)

    return { 
        success: true,
        message: 'Success. OK.',
        auth: true,
        matricula: decoded.matricula,
        user: decoded.nome,
        login: decoded.login,
        email: decoded.email,
        type: dados.tipoDocumento,
        data: {
            id: dados.id,
            cartaFrete: dados.cartaFrete,
            date: dados.date,
            motorista: dados.motorista,
            placas: dados.placas,
            observacao: dados.observacao,
            operacao: dados.operacao,
            tipoVeiculo: dados.tipoVeiculo,
            fileName: file.originalname,
            mimetype: file.mimetype,
            encoding: file.encoding
        }
    }
}    

module.exports = sccd_mobile