const fs     = require('fs')
const crypto = require('crypto')

async function receiveDataDebugAPP( req, res ) {
    let data     = req.body
    let jsonData = JSON.stringify(data, null, 4)
    let filename = crypto.randomBytes(20).toString('hex')+'.json'

    fs.writeFile(`./public/downloads/${filename}`, jsonData, function(err) {
        if (err) {
             console.log(err);
             res.json({ success:false, message: err }).status(400).end() 
        } else {
            res.json({ success:true, message: `ARQUIVO: ${filename} Gerado com Sucesso !!!` }).status(200).end() 
        }
    })
}

module.exports = receiveDataDebugAPP
