const sqlExec       = require('../connection/sqlExec')

const senhaCliente = async (req, res) => { 
    
	const par_CNPJ   = req.body.cnpj
    const par_SENHA  = Number.parseInt( req.body.senha )
    const par_GRUPOS = ','+req.body.grupos.join()+','
	
    let result  = {success: false, message: 'Dados invalidos !!!'}
    let s_sql   = `UPDATE CARGASSQL.dbo.CLI SET SENHA = ${par_SENHA} WHERE CGCCPF = '${par_CNPJ}'`
    let code    = 500
	
	if(par_SENHA>0) {
		if(par_GRUPOS.includes(',ATI,') || par_GRUPOS.includes(',ATI-Tecnicos,') || par_GRUPOS.includes(',SICONLINE,') ) {
			code   = 200
			result = {success: false, message: ''}
		} else {
			code   = 401
			result = {success: false, message: 'Acesso negado, operação não realizada !!!'}
		}		
	}
		
	if(code===200) {
		try {
			
			let ret = await sqlExec(s_sql)
			
			if (ret.rowsAffected == -1){
				throw new Error(`DB ERRO - ${ret.Erro} : SQL => [ ${s_sql} ]`)
			} else {
				result.success = (ret.rowsAffected > 0 )
				result.message = result.success ? 'Senha atualizada com sucesso !!!' : 'Registro não Localizado !!!'
				code           = result.success ? 200 : 400  
			}
			
		}  catch (err) {
		   result   = {success: false, message: 'Recurso indisponivel !!!', rotina: 'senhaCliente' ,err: err.message}
		   code = 500
		}
	}
	
	console.log('Alterar senha:', code, par_CNPJ, result)

	res.json(result).status(code) 
	    
}

module.exports = senhaCliente