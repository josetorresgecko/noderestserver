const express = require('express');
const app = express();
const Producto = require('../models/producto');
const { verificaToken, verificaAdminRole } = require('../middledwares/autenticacion');
app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    let estado = req.query.estado || true;
    desde = Number(desde);
    limite = Number(limite);
    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .sort('nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count({ estado }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });
        });
});
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "el producto no existe"
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex, descripcion: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "el producto no existe"
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});
app.post('/producto', [verificaToken], (req, res) => {
    let body = req.body;
    let iduser = req.usuario._id;
    let producto = new Producto({
        nombre: body.descripcion,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: iduser
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});
app.put('/producto/:id', [verificaToken], (req, res) => {
    let body = req.body;
    let id = req.params.id;
    let usuario = req.usuario._id;
    body.usuario = usuario;
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });

    });
});
app.delete('/producto/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    let cambiarEstado = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, cambiarEstado, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "el producto no existe"
                }
            });
        }
        res.json({
            ok: true,
            producto: productoBorrado
        });
    });
});

module.exports = app;