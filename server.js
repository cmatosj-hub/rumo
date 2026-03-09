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

app.post("/config", (req, res) => {
    const { meta, dias } = req.body;
    db.run("DELETE FROM configuracao", () => {
        db.run("INSERT INTO configuracao(meta_semanal, dias_trabalhados) VALUES(?,?)", [meta, dias], () => {
            res.send({ ok: true });
        });
    });
});

app.post("/ganhos-em-massa", (req, res) => {
    const { listaGanhos } = req.body;
    // Primeiro limpamos tudo para garantir que só fiquem os dados que você enviou agora
    db.run("DELETE FROM ganhos", () => {
        const stmt = db.prepare("INSERT INTO ganhos(data, valor) VALUES(?,?)");
        db.serialize(() => {
            listaGanhos.forEach(item => {
                if(item.valor > 0) stmt.run(item.data, item.valor);
            });
            stmt.finalize();
            res.send({ ok: true });
        });
    });
});

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

app.get("/status", (req, res) => {
    db.all(`SELECT valor FROM ganhos`, (err, rows) => {
        db.get(`SELECT * FROM configuracao LIMIT 1`, (err, config) => {
            let total = rows ? rows.reduce((acc, curr) => acc + (curr.valor || 0), 0) : 0;
            let meta = config?.meta_semanal || 0;
            let diasConfig = config?.dias_trabalhados || 5;
            res.send({
                ganhos: total,
                meta: meta,
                dias: diasConfig
            });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`RUMO rodando em http://localhost:${PORT}`);
});