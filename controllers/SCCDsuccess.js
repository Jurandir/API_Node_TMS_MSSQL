const sqlExec       = require('../connection/sqlExec')

const SCCDsuccess = async (req, res) => { 
    const par_ID = req.body.id
    const par_DESTINO = req.body.destino
	const par_FILIAL_APP = req.body.filial_app

    let s_sql    = `UPDATE SIC.dbo.SCCD_APP SET FLAG_MYSQL = 1  WHERE ID = ${par_ID} AND DT_SCCD IS NOT NULL`
    let result   = {}

    console.log(req.body,par_ID,par_DESTINO)

    try {

        if(!par_ID) {
            throw new Error(`PARÂMETRO ERRO - "id" não OK, em (SCCDsuccess) !!`)
        }
    
        result = await sqlExec(s_sql)    
        
        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${s_sql} ]`)
        } else 
        if (result.rowsAffected==0){
            result.success = false
            result.message = 'ID não encontrado, ou SCCD ainda não preparado !!!'
            result.msg = 'Not Found'
            result.id = par_ID
        } else {
            result.success = true
            result.message = 'Confirmado com sucesso !!!'
            result.id = par_ID
        }
              
        res.json(result).status(200) 
  
    } catch (err) {
        res.send({ "success":false, "message" : err.message, "rotina" : "SCCDsuccess", rowsAffected: -1, "sql" : s_sql }).status(500) 
    } 

}

module.exports = SCCDsuccess