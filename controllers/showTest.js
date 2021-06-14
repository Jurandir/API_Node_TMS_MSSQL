const fs            = require('fs')

const resposta = {
  "timestamp": "2021-06-11T11:11:43.317",
  "status": 200,
  "message": [
    {
      "message": "Ocorrência salva com sucesso",
      "posicao": 0
    }
  ],
  "path": "/v2/embarque",
  "protocolo": "a1de9323-e9c7-45e6-bcf2-a39fd9a8b0f0"
}

async function showTest( req, res ) {
	
	await sendLog('----------------------------------------------------')

	await sendLog( 'headers:' +'\r\n' + JSON.stringify( req.headers , null, 4 ) )
    console.log('headers:',req.headers)
    if ( req.method == 'POST' ) {
		
    	await sendLog( 'POST body:' +'\r\n' + JSON.stringify( req.body  , null, 4 ) )
        console.log('body:',req.body)
        res.json(resposta).status(200);
		
	}
    else if ( req.method == 'GET' ) {
        
    	await sendLog( 'GET body:' +'\r\n' + JSON.stringify( req.query , null, 4 ) )
		console.log('query:',req.body)
        res.json(resposta).status(200);
		
    } else {
        res.json({ erro: "ERRO" }).status(400);
    }
    
}

const sendLog = async ( linha ) => {
    

    let file = './public/ShowTest.txt'
	let row  = `${linha}`
    fs.writeFile(file, linha +'\r\n',  {'flag':'a'},  function(err) {
       if (err) {
           return console.error(err);
       }
    })    
}

module.exports = showTest