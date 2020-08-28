const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middledwares/autenticacion');
app.get('/usuarios', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    let estado = req.query.estado || true;
    desde = Number(desde);
    limite = Number(limite);
    Usuario.find({ estado }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });

        });
});
app.post('/usuarios', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
app.put('/usuarios/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    let id = req.params.id;
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});
app.delete('/usuarios/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let cambiarEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiarEstado, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "el usuario no existe"
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;