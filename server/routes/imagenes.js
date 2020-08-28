const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const { verificaTokenImg } = require('../middledwares/autenticacion');
app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImg = `server/uploads/${tipo}/${img}`;
    let pathNoImagen = path.resolve(__dirname, `../assets/no-image.jpg`);
    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(`${pathImagen}`);
    } else {
        res.sendFile(`${pathNoImagen}`);
    }
});

module.exports = app;