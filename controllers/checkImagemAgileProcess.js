const getImageAgileProcess   = require('../services/getImageAgileProcess')

const checkImagemAgileProcess = async (documento) => {
    let value    = documento
    let base64Str = { ok:false, msg:'Sem retorno',imagem:''}

    await getImageAgileProcess( value ).then((resposta)=>{

            if (!resposta.Err) {
                  let base64Image  = resposta.dados.json_response[0].checkpoint.resources[0].content
                  base64Str.msg   = 'Imagem recebida.'
                  base64Str.ok     = true
                  base64Str.imagem = base64Image
            } else {
                  base64Str.msg   = 'Não tem a imagem solicitada.'
            }  
                 
    }).catch((err)=>{ 
      base64Str.msg   = JSON.stringify(err)
    })

    return base64Str

}

module.exports = checkImagemAgileProcess
