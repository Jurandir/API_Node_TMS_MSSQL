const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    let bearer, token
    try {
        bearer = req.headers.authorization.split(" ")[1]
        token  = bearer.replace('"','').replace('"','')
    } catch {
        return res.status(401).json({ auth: false, message: 'Headers Authorization - Não OK.' })
    }
    if (!token) {
        return res.status(401).json({ auth: false, message: 'Token não informado.' })
    }    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) {
          return res.status(500).json({ auth: false, message: 'Falha na validação do token.' })
      }     
      req.userId = decoded.cnpj
      next()
    })
}

module.exports = verifyToken