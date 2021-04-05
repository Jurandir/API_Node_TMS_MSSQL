const sqlQuery     = require('../connection/sqlQuery')

async function listaFiliaisCliente(req, res) {
    let { cnpj } = req.query
    let resposta = {
        success: false,
        message: 'Dados não localizados !!!',
        data: [],
        rows: 0
    }

    try {
        if(!cnpj){
            throw new Error(`CNPJ/CPF não informado`)
        }

        let raiz = cnpj.substr(0,8)
        let wsql = 
        `SELECT CLI.CGCCPF CNPJ,CLI.NOME,CID.NOME CIDADE,CID.UF 
           FROM CARGASSQL.dbo.CLI 
           JOIN CARGASSQL.dbo.CID ON CID.CODIGO = CLI.CID_CODIGO
          WHERE CGCCPF like '${raiz}%'`

        data = await sqlQuery(wsql)
             
        let { Erro } = data
        if (Erro) { 
            throw new Error(`DB ERRO - ${Erro} -> ${wsql}`)
        } 
        
        resposta.success = true
        resposta.message = 'Sucesso. OK.'
        resposta.data = data
        resposta.rows = data.length
                               
        res.json(resposta).status(200) 
                  
    } catch (err) { 
        
        resposta.message = 'Erro:'+err.message
        resposta.rotine  = 'produtosTransportados'
        resposta.err     = err                            
        res.json(resposta).status(500) 

    }    
}
                

module.exports = listaFiliaisCliente
