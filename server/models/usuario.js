const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};
let usuarioSchema = new Schema({
    nombre: {
        type: 'String',
        require: [true, 'El nombre es obligatorio']
    },
    email: {
        type: 'String',
        unique: true,
        require: [true, 'El email es obligatorio']
    },
    password: {
        type: 'String',
        require: [true, 'El password es obligatorio']
    },
    img: {
        type: 'String',
        require: false
    }, //no es obligatorio
    role: {
        type: 'String',
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: 'Boolean',
        default: true
    },
    google: {
        type: 'Boolean',
        default: false
    }
});
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
module.exports = mongoose.model('Usuario', usuarioSchema);