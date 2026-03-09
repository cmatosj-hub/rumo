const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(__dirname))

const db = new sqlite3.Database("rumo.db")

db.serialize(()=>{

db.run(`
CREATE TABLE IF NOT EXISTS ganhos (
data TEXT PRIMARY KEY,
valor REAL
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS configuracao (
meta_semanal REAL,
dias_trabalhados INTEGER
)
`)

})

/* CONFIGURAÇÃO */

app.post("/config",(req,res)=>{

const {meta,dias} = req.body

db.run("DELETE FROM configuracao")

db.run(`
INSERT INTO configuracao(meta_semanal,dias_trabalhados)
VALUES(?,?)
`,[meta,dias])

res.send({ok:true})

})

/* REGISTRAR GANHO */

app.post("/ganho",(req,res)=>{

const {data,valor} = req.body

db.run(`
INSERT OR REPLACE INTO ganhos(data,valor)
VALUES(?,?)
`,[data,valor])

res.send({ok:true})

})

/* OBTER SEMANA */

app.get("/semana",(req,res)=>{

db.all(`SELECT * FROM ganhos`,(err,ganhos)=>{

db.get(`SELECT * FROM configuracao LIMIT 1`,(err,config)=>{

res.send({

ganhos:ganhos,
meta:config?.meta_semanal || 0,
dias:config?.dias_trabalhados || 5

})

})

})

})

/* STATUS DO PAINEL */

app.get("/status",(req,res)=>{

db.all(`SELECT valor FROM ganhos`,(err,rows)=>{

db.get(`SELECT * FROM configuracao LIMIT 1`,(err,config)=>{

let total = 0

rows.forEach(r=>{
total += r.valor || 0
})

let meta = config?.meta_semanal || 0
let dias = config?.dias_trabalhados || 5

let falta = meta-total

let diaria = meta/dias

res.send({

ganhos:total,
meta:meta,
falta:falta,
media:diaria

})

})

})

})

app.listen(3000,()=>{

console.log("RUMO rodando em http://localhost:3000")

})