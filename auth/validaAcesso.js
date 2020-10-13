
const validaAcesso = (cnpj_token, cnpj_pesq ) => {
    if (cnpj_token.length=14 ) {
      if (cnpj_token.substring(0,8) !== cnpj_pesq.substring(0,8) ) {
        throw new Error(`Access ERRO - RAIZ do CNPJ pesquisado não pertence ao usuário de Login`)
      }
    } else {
      if (cnpj_token !== cnpj_pesq ) {
        throw new Error(`Access ERRO - CNPJ/CPF não pertence ao usuário de Login`)
      }
    }
}

module.exports = validaAcesso
