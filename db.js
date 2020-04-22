require('dotenv').config();
var mongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

mongoClient.connect("mongodb+srv://wandinho:eu281168@cluster0-rqnoy.mongodb.net/test?retryWrites=true&w=majority",
                     { useUnifiedTopology: true })
 .then(conn => global.conn = conn.db("wrmototaxi"))
 .catch(err => console.log(err))
 console.log("Conectado")

function adicionar(item, callback){
    global.conn.collection("mototaxi").insertOne(item, callback);
}

function deletar(id, callback){
    global.conn.collection("mototaxi").deleteOne({_id: new ObjectId(id)}, callback);
}

function bloquear(id, callback){
    global.conn.collection("mototaxi").updateOne({_id: new ObjectId(id)}, {
        $set: {bloqueado : true}
    }, callback);
}

function desbloquear(id, callback){
    global.conn.collection("mototaxi").updateOne({_id: new ObjectId(id)}, {
        $set: {bloqueado : false}
    }, callback);
}
function buscarProximos(ponto, callback){

    var raio = 0.007


    var maxLat = ponto.latitude + raio
    var minLat = ponto.latitude - raio
    var maxLon = ponto.longitude + raio
    var minLon = ponto.longitude - raio

   
    
    global.conn.collection("mototaxi").find({
        $and:[{'coordnate.latitude':{  $gte :  minLat  }},
                {'coordnate.latitude':{  $lte :  maxLat  }},
                {'coordnate.longitude':{  $gte :  minLon  }},
                {'coordnate.longitude':{  $lte :  maxLon  }},
                {bloqueado:false}
    ]

    }).toArray(callback);
}

function buscarTodos(callback){
    global.conn.collection("mototaxi").find({}).toArray(callback);
}

function buscarDesbloqueados(callback){
    global.conn.collection("mototaxi").find({bloqueado:false}).toArray(callback);
}

function trocarFoto(item ,callback){

    id = item.id
    fotos = item.fotos

    global.conn.collection("mototaxi").updateOne({_id: new ObjectId(id)}, {
        $set: {fotos : fotos}
    }, callback);
}

function editar(item, callback){

    id = item.id
    title = item.title
    coordnate = item.coordnate
    qtdMotos = item.qtdMotos
    endereco = item.endereco
    telefone = item.telefone
    whatsapp = item.whatsapp
    funcionamento = item.funcionamento

    global.conn.collection("mototaxi").updateOne({_id: new ObjectId(id)}, {
        $set: {title : title,
               coordnate: coordnate,
               qtdMotos : qtdMotos,
               endereco : endereco,
               telefone, telefone,
               whatsapp : whatsapp,
               funcionamento : funcionamento,        
        }
    }, callback);

}

function buscaUm(id, callback){
    global.conn.collection("mototaxi").find({_id: new ObjectId(id)}).toArray(callback);
}
 
module.exports = {editar, buscaUm, adicionar, deletar, bloquear, desbloquear, buscarProximos, buscarTodos, buscarDesbloqueados, trocarFoto}