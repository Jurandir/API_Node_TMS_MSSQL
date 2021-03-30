const fs            = require('fs')
const path          = require('path')

const sccd_mobile   = require('../models/sccd_mobile')
const sccd_db       = require('../models/sccd_db')
const sqlExec       = require('../connection/sqlExec')
const existsSCCD    = require('../searches/existsSCCD')

const sqlFileName   = path.join(__dirname, '../sql/rotinas/INSERT_SCCD.sql')
var   sqlFile       = fs.readFileSync(sqlFileName, "utf8")

const postSCCD = async (req, res) => { 

    try {

        let v_mobile = await sccd_mobile(req)
        let v_db     = await sccd_db(v_mobile)
        let s_sql    = eval('`'+sqlFile+'`');

        let test = await existsSCCD(v_db.DOCUMENTO,v_db.OPERACAO,v_db.TIPOVEICULO,v_db.IMAGEM_ID) 
    
        if(test.success){
            // imagem já existe 
            result.rowsAffected = 0
            retult.Erro = ''
        } else {
            // imagem nova
            result = await sqlExec(s_sql)    
        }    
        
        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${s_sql} ]`)
        }
              
        res.json(v_mobile).status(200) 
  
    } catch (err) {
        res.send({ "success":false, "message" : err.message, "rotina" : "postSCCD", rowsAffected: -1, "sql" : s_sql }).status(500) 
    } 

}

module.exports = postSCCD