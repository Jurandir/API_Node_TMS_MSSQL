const existsSCCD = require('../searches/existsSCCD')

existsSCCD('SPO-56632','CARGA','NORMAL',60327).then(ret=>{
    console.log('RET:',ret)
})
