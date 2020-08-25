//===========================
// puerto
//===========================
process.env.PORT = process.env.PORT || 3000;
//===========================
// entorno
//===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
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