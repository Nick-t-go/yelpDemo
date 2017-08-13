const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const router = require('./routes/router')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '../')));
app.use(express.static(path.join(__dirname, '../client')))

app.use(function(req,res,next){
	if(path.extname(req.path).length>0){
		res.status(404).end();
	}
	else{
		next(null)
	}
})

app.use("/api", router)

app.get('/*', function(req, res){
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.use(function(err, req, res, next){
	res.status(err.status || 500).send(err.message || "internal server error")
})


app.listen(3000, function(){
	console.log('Example app listening on port 3000!')
})
