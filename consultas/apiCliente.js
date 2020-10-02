const sqlQuery = require('../connection/sqlQuery')

//                   TESTE : parametros = ["16851732000206","43673","2"]
var retorno = {}
var wemp, wctrc, wcnhserie, wwhere, wtrecho, wunidest, wcnpjentrega, wchave
var wcnpj, wnf, wnfserie
 
async function apiCliente( req, res ) {
  retorno.numero           = 0
  retorno.dataEmissao      = null 
  retorno.prevEntrega      = null
  retorno.tipoPesoM3       = null
  retorno.pesoM3           = null
  retorno.valorMercadoria  = null
  retorno.valorFrete       = null
  retorno.chave            = null
  retorno.origemPrestacao  = {}
  retorno.notaFiscal       = {}
  retorno.unidadeDestino   = {}
  retorno.ocorrencias      = []
  retorno.destinoPrestacao = {}
  retorno.localEntrega     = {}
  
  if ( req.method == 'GET' ) {
     var { cnpj, documento, serie } = req.query
     wcnpj    = cnpj
     wnf      = documento
     wnfserie = serie ? serie : ''
 }

  if ( req.method == 'POST' ) {
      var { valoresParametros } = req.body
      if (valoresParametros) {
          wcnpj    = valoresParametros[0]
          wnf      = valoresParametros[1]
          wnfserie = valoresParametros[2]
      } else {
          var { cnpj, documento, serie } = req.query
          wcnpj    = cnpj
          wnf      = documento
          wnfserie = serie ? serie : ''  
      }    
  }
  
          set_nf()
          //.then( set_cnh() )
          //.then( set_trecho() )
          //.then( set_unid_destino() )
          //.then( set_local_entrega() )
          //.then( set_ocorrencias() )
          .then( (a) => { res.json(retorno).status(200) })
          .catch( (err) => { res.send(err.message).status(500) })
}

async function set_nf() {
  sqlQuery(`
    SELECT EMP_CODIGO AS CNH_EMPRESA,CNH_SERIE,CNH_CTRC,NF,SERIE,DATA,VALOR,CHAVENFE  
    FROM NFR
    WHERE
    SERIE='${wnfserie}' AND NF=${wnf} AND CLI_CGCCPF_REMET=${wcnpj}
    `, 
             ( data ) => {
                retorno.numero          = data[0].CNH_CTRC
                retorno.dataEmissao     = data[0].DATA
                retorno.valorMercadoria = data[0].VALOR
              //------------------------------------
              retorno.notaFiscal.numero          = data[0].NF
              retorno.notaFiscal.serie           = data[0].SERIE
              retorno.notaFiscal.dataEmissao     = data[0].DATA
              retorno.notaFiscal.valor           = data[0].VALOR
              retorno.notaFiscal.chaveNFe        = data[0].CHAVENFE
              //------------------------------------
                wemp      = data[0].CNH_EMPRESA
                wcnhserie = data[0].CNH_SERIE
                wctrc     = data[0].CNH_CTRC
              //------------------------------------
              console.log('NF---->',wemp,wcnhserie,wctrc)
            }
    ).then(a => {
      
        console.log('XXXXXXXXXXXXXX====>>',a)

        if (retorno.numero  === 0) {
          wwhere=`NF='${wnf}' AND CLI_CGCCPF_REMET=${wcnpj}`
        } else {
          wwhere=`EMP_CODIGO='${wemp}' AND SERIE='${wcnhserie}' and CTRC=${wctrc} ` 
        }
        console.log('set_nf',retorno)
   })
}

async function set_cnh() {
  sqlQuery(`
    SELECT *  
    FROM CNH
    WHERE  ${wwhere} 
    `, 
            ( data ) => {
                retorno.numero           = data[0].CTRC
                retorno.dataEmissao      = data[0].DATA 
                retorno.prevEntrega      = data[0].PREVENTREGA 
                retorno.tipoPesoM3       = data[0].ESP_CODIGO
                retorno.pesoM3           = data[0].VOLUME
                retorno.valorMercadoria  = data[0].VALORNF
                retorno.valorFrete       = data[0].TOTFRETE
                retorno.chave            = data[0].CHAVECTE

                wtrecho       = data[0].TRE_CODIGO
                wcnpjentrega  = data[0].CLI_CGCCPF_DEST
               //--------------------------------------------
                wchave = `${wemp}${wcnhserie}${wctrc}` 
            }
    )
}

async function set_trecho() {
  sqlQuery(`
    SELECT TRE.CODIGO   AS TRECHO
        ,TRE.ORIGEM     AS TRECHO_ORIGEM
        ,TRE.DESTINO    AS TRECHO_DESTINO
        ,ORIGEM.NOME    AS CIDADE_ORIGEM
        ,DESTINO.NOME   AS CIDADE_DESTINO
        ,ORIGEM.UF      AS UF_ORIGEM
        ,DESTINO.UF     AS UF_DESTINO
        ,ORIGEM.CODMUN  AS IBGE_ORIGEM
        ,DESTINO.CODMUN AS IBGE_DESTINO
        ,TRE.EMP_CODIGO_ENTREGA AS UNID_DESTINO
    FROM TRE
    LEFT JOIN CID ORIGEM ON ORIGEM.CODIGO = SUBSTRING(TRE.CODIGO, 1, 3)
    LEFT JOIN CID DESTINO ON DESTINO.CODIGO = SUBSTRING(TRE.CODIGO, 4, 3)
    WHERE TRE.CODIGO = '${wtrecho}'
    `, 
            ( data ) => {
                
              console.log(data)

                retorno.origemPrestacao.nome  = data[0].CIDADE_ORIGEM
                retorno.origemPrestacao.uf    = data[0].UF_ORIGEM
                retorno.origemPrestacao.ibge  = data[0].IBGE_ORIGEM
                retorno.destinoPrestacao.nome = data[0].CIDADE_DESTINO
                retorno.destinoPrestacao.uf   = data[0].UF_DESTINO
                retorno.destinoPrestacao.ibge = data[0].IBGE_DESTINO
               //------------------------------------
                wunidest = data[0].UNID_DESTINO
            }
   )
}

async function set_unid_destino() {
  sqlQuery(`
        SELECT EMP.CODIGO,  
          EMP.NOME,    
          EMP.ENDERECO,
          EMP.NUMERO,  
          EMP.BAIRRO,  
          CID.CODMUN AS IBGE,  
          CID.NOME AS CIDADE,    
          CID.UF      
        FROM EMP
        LEFT JOIN CID ON CID.CODIGO = EMP.CID_CODIGO
        WHERE EMP.CODIGO = '${wunidest}'
  `, 
          ( data ) => {
            retorno.unidadeDestino.sigla        = data[0].CODIGO   
            retorno.unidadeDestino.nome         = data[0].NOME     
            retorno.unidadeDestino.endereco     = data[0].ENDERECO 
            retorno.unidadeDestino.numero       = data[0].NUMERO   
            retorno.unidadeDestino.bairro       = data[0].BAIRRO   
            retorno.unidadeDestino.cidade       = {}
            retorno.unidadeDestino.cidade.ibge  = data[0].IBGE         
            retorno.unidadeDestino.cidade.nome  = data[0].CIDADE       
            retorno.unidadeDestino.cidade.uf    = data[0].UF       
           //------------------------------------
    }
 )
}

async function set_local_entrega() {
  sqlQuery(`
        SELECT ENDERECO,NUMERO,BAIRRO,CID.NOME AS CIDADE,CID.UF,CID.CODMUN AS IBGE
        FROM CLI 
        LEFT JOIN CID ON CID.CODIGO = CLI.CID_CODIGO
        WHERE CGCCPF = ${wcnpjentrega}
  `, 
          ( data ) => {

            retorno.localEntrega.endereco    = data[0].ENDERECO
            retorno.localEntrega.numero      = data[0].NUMERO
            retorno.localEntrega.bairro      = data[0].BAIRRO
            retorno.localEntrega.cidade      = {}
            retorno.localEntrega.cidade.nome = data[0].CIDADE
            retorno.localEntrega.cidade.uf   = data[0].UF
            retorno.localEntrega.cidade.ibge = data[0].IBGE
           //------------------------------------
          }
 )
}

async function set_ocorrencias() {
  // ( teste = SPOE1480268 )
  sqlQuery(`
        SELECT OUN.*, OCO.NOME AS NOMEOCORRENCIA, MOT.NOME AS MOTORISTA  
        FROM OUN  
        LEFT JOIN OCO ON OCO.CODIGO=OUN.OCO_CODIGO  
        LEFT JOIN MOT ON MOT.PRONTUARIO = OUN.MOT_PRONTUARIO  
        WHERE TABELA='CNH' AND CHAVE='${wchave}' 
        ORDER BY DATA
  `, 
          ( data ) => {
            let elem
            data.forEach((item, index)=>{
              elem = {} 
              elem.codigoInterno           = item.OCO_CODIGO 
              elem.codigoProceda           = item.OCO_CODIGO 
              elem.descricaoOcorrencia     = item.NOMEOCORRENCIA 
              elem.dataRegistro            = item.DATAOCO       
              retorno.ocorrencias.push(elem)  
            })
           //------------------------------------
           console.log('RET : ',retorno) 
           console.log('-----------------------------------') 
          }
 )
}

module.exports = apiCliente
