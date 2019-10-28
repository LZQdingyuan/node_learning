let express = require('express')
let utility = require('utility')
let app = express();
app.get('/', function(req, res){
    let q = req.query.q;
    res.send(utility.md5(q))
})
app.listen(2000, function(req, res){
    console.log('哈哈哈哈，我进来了')
})