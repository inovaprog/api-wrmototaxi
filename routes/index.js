require('dotenv').config();
const fetch = require("node-fetch");
var express = require('express');
var router = express.Router();
var auth = false



/* Login -----> / GET */
router.get('/', function (req, res, next) {
  res.render('login')
});


/* Listar Todos ----- / POST */
router.post('/lista', function (req, res, next) {

  var user = req.body.user;
  var senha = req.body.senha;
  if (user == process.env.USER && senha == process.env.SENHA) {
    auth = true
  }

  if (auth) {
  fetch('http://www.wrmototaxi.appspot.com/api/lista', { method: "post" })
    .then(res => res.json())
    .then(itens => res.render('lista', { itens }))
  }else{
    res.render('login')
  }

});

/* Adicionar Moto taxi    --->     /add  POST*/
router.post('/add', function (req, res, next) {
  res.render('add');
});


/* Editar ----->   /editar/:id   POST*/ 
router.get('/edit/:id', function (req, res, next) {
  var id = req.params.id
  //buscar um pelo id
 
  fetch(`http://www.wrmototaxi.appspot.com/api/buscarum/${id}`, { method: "post" })
    .then(res => res.json())
    .then(itens => res.render('edit', { itens }))

});






module.exports = router;
