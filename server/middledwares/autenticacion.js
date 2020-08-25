const jwt = require('jsonwebtoken');
//==========================
// VERIFICAR TOKEN
//==========================
let verificaToken = (req, res, next) => {
    let token = req.get('token'); //autorization
    console.log(token);
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};
//==========================
// VERIFICA ADMINROLE
//==========================
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    console.log(usuario);
    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(400).json({
            ok: false,
            err: "El usuario no es Administrador"
        });
    }
    next();
};
module.exports = {
    verificaToken,
    verificaAdminRole
}