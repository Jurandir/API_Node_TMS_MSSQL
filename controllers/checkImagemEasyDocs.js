const getImageEasydocs   = require('../services/getImageEasydocs')

const checkImagemEasyDocs = async (documento) => {
    let value    = documento
    let base64Str = { ok:false, msg:'Sem retorno',imagem:''}

    let empresa = value.substring(0,3)
    let ctrc    = value.substring(4,10)

    await getImageEasydocs(empresa,ctrc ).then((resposta)=>{

            if (resposta.isErr) {
                  base64Str.msg   = resposta.err.message
            } else 
            if (resposta.Retorno==false) {
                  base64Str.msg   = 'Não tem a imagem solicitada.'
            } else 
            if (resposta.Retorno==true) {
                  base64Str.msg   = 'Imagem recebida.'
                  base64Str.ok     = true
                  base64Str.imagem = `${resposta.Imagem}`
            } 
                 
    }).catch((err)=>{ 
      base64Str.msg   = JSON.stringify(err)
    })
    return base64Str
}

module.exports = checkImagemEasyDocs