//===========================
// puerto
//===========================
process.env.PORT = process.env.PORT || 3000;
//===========================
// entorno
//===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//===========================
// Vencimiento de Token
//===========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '48h';
//===========================
// SEED de autenticación
//===========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
//===========================
// base de datos
//===========================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://127.0.0.1:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;
//===========================
// google client
//===========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '191538501405-3lrliq9iu7jjue5a4pdi3fcfelpb8o1g.apps.googleusercontent.com';