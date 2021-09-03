var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5');

const DBSOURCE = 'db.sqlite';

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if(err){
        console.error(err.message);
        throw err;
    }else{
        //codigo, nome, sobrenome, idade, data_criacao, data_atualizacao
        console.log('Conectado ao SQLite database');
        db.run(`CREATE TABLE clientes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome text,
            sobrenome text,
            idade INTEGER,
            data_criacao DATE,
            data_atualizacao DATE
        )`,
        (err) => {
            if(err){

            }else{
                var data = new Date();
                data_hoje = data.getFullYear()+"-"+data.getMonth()+"-"+data.getDay();
                var insert = 'INSERT INTO clientes (nome, sobrenome, idade, data_criacao,data_atualizacao) VALUES (?,?,?,?,?)';
                db.run(insert, ['Cliente', 'Primeiro', 20, data_hoje, data_hoje]);
            }
        });
    }
});

module.exports = db;