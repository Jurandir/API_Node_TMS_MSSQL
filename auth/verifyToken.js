const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    let bearer, token
    try {
        bearer    = req.headers.authorization.split(" ")[1]
        token     = bearer.replace('"','').replace('"','')
        req.token = token
    } catch (err) {
        res.status(401).json({ auth: false, message: 'Headers Authorization - Não OK.', err: err })
		return 0
    }
	
    if (!token) {
        res.status(401).json({ auth: false, message: 'Token não informado.' })
		return 0
    }    
	
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
	  if(decoded==undefined){
          res.status(401).json({ auth: false, message: 'Falha na validação do token.' })		  
		  return 0
	  }		  
      if (err) {
          res.status(500).json({ auth: false, message: 'Falha na validação do token.' , err: err })
		  return 0
      }     
      req.userId = decoded.cnpj
	  if (decoded.grupos) {
		  req.loginAD = true
	  } else {
		  req.loginAD = false		  
	  }	  
      next()
    })
}

module.exports = verifyToken