async function teste( req, res ) {

    if ( req.method == 'POST' ) {
        const { cnpj, quitado, dataini, datafin } = req.body
        res.json(req.body).status(200);
    } else {
        res.json({ post: "ERRO" }).status(400);
    }

    
}

module.exports = teste