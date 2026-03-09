const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const db = new sqlite3.Database("rumo.db");

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS ganhos (data TEXT PRIMARY KEY, valor REAL)`);
    db.run(`CREATE TABLE IF NOT EXISTS configuracao (meta_semanal REAL, dias_trabalhados INTEGER)`);
});

// CONFIGURAÇÃO
app.post("/config", (req, res) => {
    const { meta, dias } = req.body;
    db.run("DELETE FROM configuracao", () => {
        db.run("INSERT INTO configuracao(meta_semanal, dias_trabalhados) VALUES(?,?)", [meta, dias], () => {
            res.send({ ok: true });
        });
    });
});

// REGISTRAR GANHOS EM MASSA (Melhorado)
app.post("/ganhos-em-massa", (req, res) => {
    const { listaGanhos } = req.body;
    const stmt = db.prepare("INSERT OR REPLACE INTO ganhos(data, valor) VALUES(?,?)");
    
    db.serialize(() => {
        listaGanhos.forEach(item => {
            stmt.run(item.data, item.valor);
        });
        stmt.finalize();
        res.send({ ok: true });
    });
});

// OBTER DADOS DA SEMANA
app.get("/semana", (req, res) => {
    db.all(`SELECT * FROM ganhos`, (err, ganhos) => {
        db.get(`SELECT * FROM configuracao LIMIT 1`, (err, config) => {
            res.send({
                ganhos: ganhos || [],
                meta: config?.meta_semanal || 0,
                dias: config?.dias_trabalhados || 5
            });
        });
    });
});

// STATUS DO PAINEL
app.get("/status", (req, res) => {
    db.all(`SELECT valor FROM ganhos`, (err, rows) => {
        db.get(`SELECT * FROM configuracao LIMIT 1`, (err, config) => {
            let total = rows ? rows.reduce((acc, curr) => acc + (curr.valor || 0), 0) : 0;
            let meta = config?.meta_semanal || 0;
            let falta = meta - total;
            res.send({
                ganhos: total,
                meta: meta,
                falta: falta < 0 ? 0 : falta
            });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`RUMO rodando em http://localhost:${PORT}`);
});