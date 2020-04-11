require('dotenv').config();
var router = require ('express').Router();
var db = require('../db')
let multer = require('multer');
const aws = require('aws-sdk')
const multers3 = require('multer-s3');
var storageTypes = {

    local: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/mototaxi')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
    s3: multers3({
        s3: new aws.S3(),
        bucket: 'wrmototaxi' ,
        contentType: multers3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
}
var upload = multer({ storage: storageTypes['s3'] })

// Pagina de API
router.get('/', function (req, res, next) {
   
    res.render('login');
});

//lista 
router.post('/lista', function (req, res, next) {
    db.buscarTodos((e, mototaxi) => {
        if (e) { return console.log(e); }
        res.send(mototaxi);
    })
});

router.post('/ativos', function (req, res, next) {
    db.buscarDesbloqueados((e, mototaxi) => {
        if (e) { return console.log(e); }
        res.send(mototaxi);
    })
});

router.post('/busca', function (req, res, next) {
    var coordnate = {
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude)
    }
    db.buscarProximos( coordnate ,(e, mototaxi) => {
        if (e) { return console.log(e); }
        res.send(mototaxi);
    })
});

router.post('/adicionar', function(req, res){
    var coordnate = {
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude)
    }
    var title = req.body.title
    var endereco = req.body.endereco
    var telefone = req.body.telefone
    var whatsapp = req.body.whatsapp
    var funcionamento = req.body.funcionamento
    var qtdMotos = parseInt(req.body.qtdMotos)
    var fotos = 'padrao-wr.png'
    var bloqueado = false
 
     db.adicionar({ coordnate, title,endereco, telefone, whatsapp, funcionamento, qtdMotos, fotos, bloqueado }, (err, result) => {
        if (err) { return console.log(err); }
        res.render('sucesso');
    })
})

router.post('/foto/:id', upload.single('file'), function(req, res){
    
    var fotos = req.file.key
    var id = req.params.id 

    console.log(fotos)
    console.log(id)

    db.trocarFoto({id, fotos}, (e, r) => {
        if (e) { return console.log(e); }
        res.render('sucesso');
    })
})

router.get('/delete/:id',  async function (req, res) {
    var id = req.params.id;
    db.deletar(id, (e, r) => {
        if (e) { return console.log(e) }
        res.render('sucesso');
    });

})

router.post('/edit/', async function (req, res) {
    var id = req.body.id;
    
    var coordnate = {
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude)
    }
    var title = req.body.title
    var endereco = req.body.endereco
    var telefone = req.body.telefone
    var whatsapp = req.body.whatsapp
    var funcionamento = req.body.funcionamento
    var qtdMotos = parseInt(req.body.qtdMotos)
    var bloqueado = false
 
     db.editar({id, coordnate, title, endereco, telefone, whatsapp, funcionamento, qtdMotos, bloqueado }, (err, result) => {
        if (err) { return console.log(err); }
        res.render('sucesso');
        });

})

router.get('/bloquear/:id',  async function (req, res) {
    var id = req.params.id;
    db.bloquear(id, (e, r) => {
        if (e) { return console.log(e) }
        res.render('sucesso');
    });

})



router.get('/desbloquear/:id',  async function (req, res) {
    var id = req.params.id;
    console.log('testes')
    db.desbloquear(id, (e, r) => {
        if (e) { return console.log(e) }
        res.render('sucesso');
    });

})

router.post('/buscarum/:id', async function (req, res, next) {
    var id = req.params.id;
   
    db.buscaUm(id, (e, mototaxi) => {
        if (e) { return console.log(e); }
        res.send(mototaxi);
    })
});



module.exports = router;