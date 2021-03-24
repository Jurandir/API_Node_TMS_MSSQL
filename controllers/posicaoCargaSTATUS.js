const sqlQuery     = require('../connection/sqlQuery')

async function posicaoCargaSTATUS( req, res ) {
    let { ctrc } = req.query
    if(!ctrc) { ctrc = req.body || 'XXXO9999999999' }
    let emp    = `${ctrc}`.substr(0,3)
    let serie  = `${ctrc}`.substr(3,1)
    let numero =  `${ctrc}`.substr(4,10)
    let retorno = {
        success: false,
        message: `CTRC ${ctrc} não localizada.`,
        info: {},
        status: 'Sem Status'
    }

    console.log(emp,serie,numero)

    var wsql = `SELECT CNH.DATA AS DATACTRC
                    ,MNF.DATA AS DATAMNF
                    ,MNF.CHEGADA AS CHEGADAMNF
                    ,IME.MEG_CODIGO AS CODIGOMEG
                    ,MEG.DATA AS DATAMEG
                    ,MEG.TIPOENTREGA AS TIPOENTREGA
                    ,MNF.DTINICIODESCARGA AS INICIODESCARGA
                    ,MNF.DTFINALDESCARGA AS FINALDESCARGA
                    ,CNH.DATAENTREGA AS DATAENTREGA
                FROM CNH
                LEFT JOIN TRB ON CNH.EMP_CODIGO = TRB.EMP_CODIGO_CNH AND CNH.SERIE      = TRB.CNH_SERIE	AND CNH.CTRC           = TRB.CNH_CTRC
                LEFT JOIN MNF ON TRB.EMP_CODIGO = MNF.EMP_CODIGO	 AND TRB.MNF_CODIGO = MNF.CODIGO
                LEFT JOIN IME ON IME.CNH_CTRC   = CNH.CTRC	         AND IME.CNH_SERIE  = CNH.SERIE	    AND IME.EMP_CODIGO_CNH = CNH.EMP_CODIGO
                LEFT JOIN MEG ON MEG.CODIGO     = IME.MEG_CODIGO	 AND MEG.EMP_CODIGO = IME.EMP_CODIGO
                WHERE CNH.EMP_CODIGO = '${emp}'
                    AND CNH.SERIE = '${serie}'
                    AND CNH.CTRC = ${numero}
                `
    try {
        let data = await sqlQuery(wsql)
        let ok   = (data.length > 0)
        retorno.info = data[0]
        retorno.success = ok
        retorno.message = 'Sucesso. OK.'
        retorno.status  = status(retorno.info)

  
        let { Erro } = data
        if (Erro) { 
          throw new Error(`DB ERRO - ${Erro} - Params = [ ${wcnpj}, ${wdata_ini}, ${wdata_fin} ]`)
        }  
               
        res.json(retorno).status(200) 
  
    } catch (err) { 
        retorno.message = err.message
        retorno.info    = err
        err.sql         = wsql
        res.json(retorno).status(500) 
    }  
    
    function status (dados) {
        let STATUS = ''
        if(dados.DATACTRC && !dados.DATAMNF &&  !dados.CHEGADAMNF  && !dados.CODIGOMEG && !dados.DATAMEG){
            STATUS = `Mercadoria aguardando Embarque na Origem desde ${ format_data_atc( dados.DATACTRC ) }`
        
        }else if(dados.DATACTRC && dados.DATAMNF &&  !dados.CHEGADAMNF  && !dados.CODIGOMEG && !dados.DATAMEG){
            STATUS = `Mercadoria em Transito desde ${ format_data_atc( dados.DATAEMBARQUE ) }`
        
        }else if(dados.DATACTRC && dados.DATAMNF &&  dados.CHEGADAMNF  && !dados.INICIODESCARGA && !dados.FINALDESCARGA && !dados.CODIGOMEG && !dados.DATAMEG){
            STATUS = `Veiculo no Patio desde ${ format_data_atc(dados.CHEGADAMNF) } (Mercadoria Aguardando Descarga)`;
        
        }else if(dados.DATACTRC && dados.DATAMNF &&  dados.CHEGADAMNF  && dados.INICIODESCARGA && !dados.FINALDESCARGA && !dados.CODIGOMEG && !dados.DATAMEG){
            STATUS = `Mercadoria em deposito destino desde ${ format_data_atc(dados.INICIODESCARGA) } (Descarregando)`
        
        }else if(dados.DATACTRC && dados.DATAMNF &&  dados.CHEGADAMNF  && dados.INICIODESCARGA && dados.FINALDESCARGA && !dados.CODIGOMEG && !dados.DATAMEG){
            STATUS = `Mercadoria em deposito destino desde ${ format_data_atc(dados.FINALDESCARGA) }`
        
        }else if(dados.CODIGOMEG && dados.DATAMEG && dados.TIPOENTREGA=="R" && !dados.DATAENTREGA){
            STATUS = `Mercadoria saiu para entrega por Redespacho em ${ format_data_atc(dados.DATAMEG) }`
        
        }else if(dados.CODIGOMEG && dados.DATAMEG && !dados.DATAENTREGA){
            STATUS = `Mercadoria saiu para Entrega em ${ format_data_atc(dados.DATAMEG) } `
        
        }else if(dados.DATACTRC && dados.DATAMNF && dados.CHEGADAMNF  && dados.CODIGOMEG && dados.DATAMEG && dados.TIPOENTREGA=="R" && dados.DATAENTREGA){
            STATUS = `Mercadoria entregue por Redespacho em ${ format_data_atc(dados.DATAENTREGA) }`
        
        }else if(dados.DATACTRC && dados.DATAMNF && dados.DATAMEG && dados.DATAENTREGA){
            STATUS = `Mercadoria Entregue em ${ format_data_atc(dados.DATAENTREGA) }`
        
        }else{
        
            STATUS = "Sem Status"
        }	
        return STATUS
    }

    function format_data_atc (dtParam) {
        let dt_iso =  new Date( Date.parse( dtParam ) ).toISOString() 
        let hs_str = dt_iso.substr(11,8)
        let dt_str = dt_iso.substr(8,2) +'/'+dt_iso.substr(5,2)+'/'+dt_iso.substr(0,4)+( hs_str=='00:00:00' ? '' : ' '+hs_str )
        return dt_str
    }    
}

module.exports = posicaoCargaSTATUS