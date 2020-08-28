const express = require('express');
const app = express();
const Categoria = require('../models/categoria');
const { verificaToken, verificaAdminRole } = require('../middledwares/autenticacion');
app.get('/categoria', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    let estado = req.query.estado || true;
    desde = Number(desde);
    limite = Number(limite);
    Categoria.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.count({ estado }, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            });
        });
});
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "la Categoría no existe"
                    }
                });
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        });
});
app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let iduser = req.usuario._id;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: iduser
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let id = req.params.id;
    let usuario = req.usuario._id;
    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion, usuario }, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let cambiarEstado = {
        estado: false
    };
    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "el usuario no existe"
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrado
        });
    });
});


module.exports = app;