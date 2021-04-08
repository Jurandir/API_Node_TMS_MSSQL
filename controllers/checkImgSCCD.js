const sqlQuery     = require('../connection/sqlQuery')

async function checkImgSCCD( req, res ) {
    let data = req.body.list || []
    let ret  = []
    for await (item of data) {
        try {
            let wsql = `SELECT 1 OK FROM SIC.dbo.SCCD_APP  WHERE ARQUIVO = '${item.file}' AND IMAGEM_ID = ${item.id}`
            let seek = await sqlQuery(wsql)
            console.log(item,seek)
            item.found = ( seek.length > 0 )
            item.err   = ''
        } catch (err) {
            item.found = false
            item.err   = err.message
        }
        ret.push(item)
    }
    
    res.json(ret).status(200).end() 
}

module.exports = checkImgSCCD
