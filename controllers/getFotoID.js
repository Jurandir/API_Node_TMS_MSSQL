const sqlQuery     = require('../connection/sqlQuery')
const baseURL      = 'http://192.168.0.45:5000'

async function getFotoID( req, res ) {
    let { id, documento } = req.query

    if (!id && !documento) {
        res.json({ "success": false , message : "Sem Parâmetros" }).status(500) 
        return 0
    }    

    let fg_id    = 0
    let s_filter = ``

    if(id) {
        fg_id    = 1
        s_filter = `ID = ${id}`
    } else {
        s_filter = `DOCUMENTO = '${documento}'`
    }


    var wsql = `SELECT *
                FROM SIC.dbo.SCCD_APP 
                WHERE ${s_filter}
                `				
    try {
				
        let data = await sqlQuery(wsql)
  
        let { Erro } = data
        if (Erro) { 
          throw new Error(`DB ERRO - ${Erro} - Params = [ ${id}, ${documento} ]`)
        }  

        let ret  = data[0]
        let file = ret.DESTINO
        
        if(fg_id){
          res.download( file )
        } else {

            let dados = data.map((i)=>{
                par_id = i.ID
                i.DOWNLOAD = req.protocol + '://' + req.get('host') + `/api/sccdfoto?id=${par_id}`
                i.URL = `${baseURL}/sccd/uploads/${i.ARQUIVO}`
                return i
            })

            res.json(dados).status(200) 
        }
  
    } catch (err) { 
        res.send({ "erro" : err.message, "rotina" : "getFotoID", "sql" : wsql }).status(500) 
    }    
}

module.exports = getFotoID
