const sqlQuery = require('../connection/sqlQuery')

var parametros = ["16851732000206","43673","2"]
var retorno = {}
var wemp,wctrc,wcnhserie,wwhere,wtrecho

var wcnpj    = parametros[0]
var wnf      = parametros[1]
var wnfserie = parametros[2]

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
           test_numero()
         }
)

/*

  retorno.notaFiscal = {
    "numero": 0,
    "serie": 0,
    "dataEmissao": now,
    "valor": 0.00,
    "chaveNFe": ""
  }

  retorno.unidadeDestino = {
    "sigla": "",
    "nome": "",
    "endereco": "",
    "numero": 0,
    "bairro": "",
    "cidade": {
      "ibge": 0,
      "nome": "",
      "uf": ""
    }
  }

  retorno.ocorrencias =  [
        {
        "codigoInterno": 0,
        "codigoProceda": "",
        "descricaoOcorrencia": "",
        "dataRegistro": now
        }
  ]

  retorno.localEntrega = {
    "endereco": "",
    "numero": 0,
    "bairro": "",
    "cidade": {
      "nome": "",
      "uf": "",
      "ibge": 0
    }
  }    

console.log('Paramêtros:',parametros)

*/
//console.log('retorno:',retorno)


function test_numero() {
    if (retorno.numero  === 0) {
        wwhere=`NF='${wnf}' AND CLI_CGCCPF_REMET=${wcnpj}`
    } else {
        wwhere=`EMP_CODIGO='${wemp}' AND SERIE='${wcnhserie}' and CTRC=${wctrc} ` 
    }    
    set_cnh()
}

function set_cnh() {
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

                wtrecho = data[0].TRE_CODIGO
                set_trecho()
            }
    )
}

function set_trecho() {
    console.log('Trecho OK')
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
    FROM TRE
    LEFT JOIN CID ORIGEM ON ORIGEM.CODIGO = SUBSTRING(TRE.CODIGO, 1, 3)
    LEFT JOIN CID DESTINO ON DESTINO.CODIGO = SUBSTRING(TRE.CODIGO, 4, 3)
    WHERE TRE.CODIGO = '${wtrecho}'
    `, 
            ( data ) => {
                retorno.origemPrestacao.nome  = data[0].CIDADE_ORIGEM
                retorno.origemPrestacao.uf    = data[0].UF_ORIGEM
                retorno.origemPrestacao.ibge  = data[0].IBGE_ORIGEM
                retorno.destinoPrestacao.nome = data[0].CIDADE_DESTINO
                retorno.destinoPrestacao.uf   = data[0].UF_DESTINO
                retorno.destinoPrestacao.ibge = data[0].IBGE_DESTINO
               //------------------------------------
                console.log('TRE:',retorno) 
            }
   )
}
