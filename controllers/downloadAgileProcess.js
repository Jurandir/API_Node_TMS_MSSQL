const fs                   = require('fs')
const getImageAgileProcess = require('../services/getImageAgileProcess')
const hostSrv              = 'http://201.49.34.12:5000/downloads/images/'

// let cod_ctrc = "SPOE3271600"

async function downloadAgileProcess( req, res ) {
    let cod_ctrc    = req.query.ctrc
    let fileName    = `Img_${cod_ctrc}`
    let path        ='./public/images'
    let arq         = `${path}/${fileName}.png`

    let data = { success: false, message: 'parâmetro "ctrc" não informado !!!', url:'' }

    if(!cod_ctrc) {
        res.json(data).status(400)  // 400 Bad Request
        return
    }

    if (fs.existsSync(arq)) {
        data = { success: true, message: 'Pesquisa. OK.', url: `${hostSrv}${fileName}.png`, file: `${fileName}.png`  }
        res.json(data).status(200)  // OK
        return
    }

    getImageAgileProcess(cod_ctrc).then((ret)=>{
        let resources = []
        let content_type = ''
        let content_label = ''
        let imagem = null
        try {
            resources.push(...ret.dados.json_response[0].checkpoint.resources)
        } catch (err) {
            content_type  = 'ERRO'
            content_label = 'ERRO'
        }

        resources.map(itn=>{
            content_type  = itn.content_type
            content_label = itn.content_label
            console.log('content_type:',content_type,content_label)
            if(content_type=='PHOTO') {
                imagem = itn.content
            }
        })

        let base64Str   =  `${imagem}`

        console.log(`Imagem (${fileName}.png), LEN:`,base64Str.length)

        if( base64Str.length< 1000 ) {
            data = { success: false, message: 'Imagem não localizada !!!', url: '' , file: ''}
            res.json(data).status(404)  // 404 Not Found
            return    
        }

        let buff        = new Buffer.from(base64Str, 'base64')
        fs.writeFileSync(arq , buff)
        
        data = { success: true, message: 'Sucesso. OK.', url: `${hostSrv}${fileName}.png`, file: `${fileName}.png` }
        res.json(data).status(201)  // Criado
    })
}

module.exports = downloadAgileProcess
