const sqlExec       = require('../connection/sqlExec')

const baixaSCCD = async (req, res) => { 
    const par_ID = req.body.id
    const par_DESTINO = req.body.destino
	const par_FILIAL_APP = req.body.filial_app

    let s_sql    = `UPDATE SIC.dbo.SCCD_APP 
                    SET DT_SCCD = CURRENT_TIMESTAMP,
					    FILIAL_APP = '${par_FILIAL_APP}',
                        DESTINO = '${par_DESTINO}' 
                    WHERE ID = ${par_ID}`
    let result   = {}

    console.log(req.body,par_ID,par_DESTINO)

    try {

        if(!par_ID) {
            throw new Error(`PARÂMETRO ERRO - "id" não OK, em (baixaSCCD) !!`)
        }
    
        result = await sqlExec(s_sql)    
        
        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${s_sql} ]`)
        } else 
        if (result.rowsAffected==0){
            result.success = false
            result.message = 'ID não encontrado !!!'
            result.msg = 'Not Found'
            result.id = par_ID
        } else {
            result.success = true
            result.message = 'Baixado com sucesso !!!'
            result.id = par_ID
        }
              
        res.json(result).status(200) 
  
    } catch (err) {
        res.send({ "success":false, "message" : err.message, "rotina" : "baixaSCCD", rowsAffected: -1, "sql" : s_sql }).status(500) 
    } 

}

module.exports = baixaSCCD