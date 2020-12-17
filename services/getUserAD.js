var ActiveDirectory = require('activedirectory');

require('dotenv').config()

const AD_URL      = `ldap://${process.env.AD_URL}`
const AD_BASE_DN  = `dc=${process.env.AD_BASE_DN}`
const AD_DOMINIO  = `${process.env.AD_DOMINIO}`
let logon         = {}

let membroUser = (ad,user) => new Promise(function(resolve, reject) {
    ad.getGroupMembershipForUser(user, function(err, groups) {
    logon.groups = groups || []
    if (err) {
        logon.isErr=true
        logon.err = err
        reject( logon )
    } else {
        resolve( logon )
    }
})
})

let userDet = (ad,conta) => { 
    
    return new Promise(function(resolve, reject) {
    ad.findUser(conta, function(err, user) {        
        if (err) {
          logon.success  = false
          logon.isErr    = true
          logon.err      = err
          logon.message  = 'Falha na autenticação'
          resolve( logon )

        } else {
            if (user) {
                logon            = JSON.parse( JSON.stringify(user).replace('User','User:') )
                logon.success    = true
                logon.isErr      = false
                membroUser(ad,conta).then(()=>{
                    resolve( logon )
                }).catch((err)=>{
                    resolve( logon )
                })
            } else {
                logon.success = false
                logon.message = `Conta (${conta}) não encontada !!!`          
                reject( logon )
            }
        }                
    })    
})
}

let getUserAD = ((conta,password) => {   
    return new Promise(function(resolve, reject) {
        logon.success = false
        logon.isErr   = false
        logon.message = ''

        let config = { url: AD_URL,
            baseDN: AD_BASE_DN,
            username: conta+'@'+AD_DOMINIO,
            password: password }
        let ad = new ActiveDirectory(config)

        userDet(ad,conta).then((ret)=>{
            resolve(ret)
        }).catch((err)=>{
            reject(err)
        })    

    })
})

module.exports = getUserAD
