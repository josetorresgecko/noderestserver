const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const usuario = require('../models/usuario');
const fs = require('fs');
const path = require('path');
// default options
app.use(fileUpload());
//extensiones permitidas
let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
//tipos permitidos
let tipoValido = ['usuarios', 'producto'];
app.put('/uploads/:tipo/:id', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let tipo = req.params.tipo;
    let id = req.params.id;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];
    //cambiar nombre del archivo
    let nombreArchivoup = `${id}-${new Date().getMilliseconds()}.${extension}`;
    if (tipoValido.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'los tipos permitidos son: ' + tipoValido.join(','),
                tipo
            }
        });
    }
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extensiones permitidas son: ' + extensionesValidas.join(','),
                extension
            }
        });
    }
    archivo.mv(`server/uploads/${tipo}/${nombreArchivoup}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivoup, tipo);
        } else {
            if (tipo === 'producto') {
                imagenProducto(id, res, nombreArchivoup, tipo);
            }
        }

    });
});

function imagenUsuario(id, res, nombreArchivoup, tipo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivoup, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el usuario no existe'
                }
            });
        }
        borrarArchivo(usuarioDB.img, tipo);
        usuarioDB.img = nombreArchivoup;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivoup
            })
        });
    });
}

function borrarArchivo(archivoB, tipoA) {
    let pathImagen = path.resolve(__dirname, `../uploads/${tipoA}/${archivoB}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

function imagenProducto(id, res, nombreArchivoup, tipo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivoup, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el producto no existe'
                }
            });
        }
        borrarArchivo(productoDB.img, tipo);
        productoDB.img = nombreArchivoup;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivoup
            })
        });
    });
}


module.exports = app;