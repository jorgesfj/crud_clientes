var express = require('express');
var app = express();
var db = require('./db/database.js');
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));

var HTTP_PORT = 8080;

app.listen(HTTP_PORT, () => {
    console.log("Servidor rodando na porta " + HTTP_PORT);
});

//Buscar todos os clientes
app.get("/", (req,res) => {
    var sql = "SELECT * FROM clientes";
    var params = []
    db.all(sql, params, (err, rows) => {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }

        res.render('listar_clientes', {"clientes": rows});
    });
});


//Buscar todos os clientes API
app.get("/api/clientes", (req,res) => {
    var sql = "SELECT * FROM clientes";
    var params = []
    db.all(sql, params, (err, rows) => {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }

        res.json({
            "message":"success",
            "data":rows
        });
    });
});

//Buscar cliente por ID
app.post("/clientes/id", (req,res) => {
    var sql = "SELECT * FROM clientes WHERE id = ?";
    var params = req.body.id;
    db.get(sql, params, (err, row) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        console.log(row)
        res.render('encontrar_cliente', {cliente:row});
    });
});

//Buscar cliente por Id API
app.get("/api/cliente/:id", (req,res) => {
    var sql = "SELECT * FROM clientes WHERE id = ?";
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});

app.get("/create", (req, res) => {
    res.render('criar_cliente');
});

//Criar um novo cliente
app.post("/clientes/create", (req,res) => {
    var errors = [];
    var data = new Date();
    var month;
    var day;
    if(data.getMonth()+1 < 10){
        month = "0"+(data.getMonth()+1);
    }else{ month = data.getMonth()+1}
    if(data.getDate() < 10){
        day = "0"+data.getDate();
    }else{ day = data.getDate()}

    data_hoje = data.getFullYear()+"-"+month+"-"+day;
  
    if(errors.length){
        res.status(400).json({"error": erros.json(",")});
        return;
    }
    //codigo, nome, sobrenome, idade, data_criacao, data_atualizacao
    var data  = {
        nome:req.body.nome,
        sobrenome: req.body.sobrenome,
        idade: req.body.idade,
        data_criacao: data_hoje,
        data_atualizacao: data_hoje
    }

    var sql = 'INSERT INTO clientes ( nome, sobrenome, idade, data_criacao, data_atualizacao) VALUES (?,?,?,?,?)';
    var params = [data.nome, data.sobrenome, data.idade, data.data_criacao, data.data_atualizacao];
    db.run(sql, params, function(err, result){
        if(err){
            res.status(400).json({"error": err.message});
            return;
        }
        res.redirect("/");
    }); 
});

//Criar novo cliente API
app.post("/api/cliente/", (req, res, next) => {
    var errors=[]
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = new Date();
    var month;
    var day;
    if(data.getMonth()+1 < 10){
        month = "0"+(data.getMonth()+1);
    }else{ month = data.getMonth()+1}
    if(data.getDate() < 10){
        day = "0"+data.getDate();
    }else{ day = data.getDate()}

    data_hoje = data.getFullYear()+"-"+month+"-"+day;
  
    if(errors.length){
        res.status(400).json({"error": erros.json(",")});
        return;
    }
    //codigo, nome, sobrenome, idade, data_criacao, data_atualizacao
    var data  = {
        nome:req.body.nome,
        sobrenome: req.body.sobrenome,
        idade: req.body.idade,
        data_criacao: data_hoje,
        data_atualizacao: data_hoje
    }
    var sql = 'INSERT INTO clientes ( nome, sobrenome, idade, data_criacao, data_atualizacao) VALUES (?,?,?,?,?)';
    var params = [data.nome, data.sobrenome, data.idade, data.data_criacao, data.data_atualizacao];
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.post("/atualizar", (req,res) => {
    var cliente = {
        id: req.body.id,
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        idade: req.body.idade,
        data_criacao: req.body.data_criacao
    }   
    res.render('atualizar_cliente', {cliente: cliente});
});

//Atualizar Cliente - Nao utilizei o app.put pois nem todos os navegadores tem suporte
app.post("/atualizar/cliente", (req, res) => {
    var data = new Date();
    var month;
    var day;
    if(data.getMonth()+1 < 10){
        month = "0"+(data.getMonth()+1);
    }else{ month = data.getMonth()+1}
    if(data.getDate() < 10){
        day = "0"+data.getDate();
    }else{ day = data.getDate()}

    data_hoje = data.getFullYear()+"-"+month+"-"+day;

    var data = {
        id: req.body.id,
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        idade: req.body.idade,
        data_criacao: req.body.data_criacao,
        data_atualizacao: data_hoje
    }

    db.run(
        `UPDATE clientes SET
        nome = COALESCE(?,nome),
        sobrenome = COALESCE(?, sobrenome),
        idade = COALESCE(?, idade),
        data_criacao = COALESCE(?, data_criacao),
        data_atualizacao = COALESCE(?, data_atualizacao)
        WHERE id = ?`,
        [data.nome, data.sobrenome, data.idade, data.data_criacao, data.data_atualizacao, data.id],
        function(err,result) {
            if(err){
                res.status(400).json({"error": res.message});
                return;
            }
            res.redirect("/");
        }
    );
});

//Atualizaar cliente API
app.patch("/api/clientes/:id", (req, res, next) => {
    var data = new Date();
    var month;
    var day;
    if(data.getMonth()+1 < 10){
        month = "0"+(data.getMonth()+1);
    }else{ month = data.getMonth()+1}
    if(data.getDate() < 10){
        day = "0"+data.getDate();
    }else{ day = data.getDate()}

    data_hoje = data.getFullYear()+"-"+month+"-"+day;

    var data = {
        id: req.body.id,
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        idade: req.body.idade,
        data_criacao: req.body.data_criacao,
        data_atualizacao: data_hoje
    }
    db.run(
        `UPDATE clientes SET
        nome = COALESCE(?,nome),
        sobrenome = COALESCE(?, sobrenome),
        idade = COALESCE(?, idade),
        data_criacao = COALESCE(?, data_criacao),
        data_atualizacao = COALESCE(?, data_atualizacao)
        WHERE id = ?`,
        [data.nome, data.sobrenome, data.idade, data.data_criacao, data.data_atualizacao, data.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
});

//Deletar Cliente - Nao utilzei o app.delete, pois nem todos os navegadores tem suporte.
app.get('/clientes/delete/:id', (req,res) => {
    db.run(
        'DELETE FROM clientes WHERE id = ?',
        req.params.id,
        function(err, result){
            if(err){
                res.status(400).json({"error": res.message});
                return;
            }
            res.redirect("/");
        }
    );
});

//Deletar Cliente API
app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM clientes WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

app.get('/buscar/cliente', (req,res) => {
    res.render("encontrar_cliente", {cliente: "null"});
});

app.use((req,res,next) => {
    res.status(404);
});