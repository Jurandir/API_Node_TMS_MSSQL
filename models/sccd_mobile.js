const sccd_mobile = async ( req ) => {
    const { body , file , decoded } = req
    return { 
        success: true,
        message: 'Success. OK.',
        auth: true,
        matricula: decoded.matricula,
        user: decoded.nome,
        email: decoded.email,
        type: body.tipoDocumento,
        data: {
            id: body.id,
            cartaFrete: body.cartaFrete,
            date: body.data,
            motorista: body.motorista,
            placas: body.placas,
            observacao: body.observacao,
            operacao: body.operacao,
            tipoVeiculo: body.tipoVeiculo,
            fileName: file.originalname,
            mimetype: file.mimetype,
            encoding: file.encoding
        }
    }
}    

module.exports = sccd_mobile