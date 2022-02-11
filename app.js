const express = require("express");
const path = require("path");
const fileupload = require('express-fileupload');
require('dotenv').config();
const hbs = require("hbs");
const session = require("express-session");
const app = express();
const nodemailer = require('nodemailer');
const PORT = 3000;


//MIDDLEWARE FILEUPLOAD
app.use(fileupload ({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

//BODY-PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//HBS
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, './views/partials'));
app.use(express.static(path.join(__dirname, './public')));

//ENRUTADOR
const routeIndex = require("./routes/index");
const routeContacto = require("./routes/contacto");
const routeCatalogo = require("./routes/catalogo");
const routeLogin = require("./routes/login");
const routeSecret = require("./routes/secret");
const routeProducts = require('./routes/products');
const routeRegister = require('./routes/register');


//CONFIGURACIÓN EXPRESS-SESSION
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

//mMIDDLEWARE ACCESO RUTA 'SECRET'
const secured = async (req, res, next) => {
  if (req.session.user) {
    app.locals.user = req.session.user;
    next();
  } else {
    res.render("noAuth");
  }
};

const isAuth = (req, res, next) => {
  app.locals.user = req.session.user;
  next();
};


//uso de rutas
app.use("/", isAuth, routeIndex);
app.use("/contacto", routeContacto);
app.use("/catalogo", routeCatalogo);
app.use("/login", routeLogin);
app.use('/products', secured, routeProducts)
app.use("/secret", secured, routeSecret);
app.use('/register', routeRegister);
app.get("*", (req, res) => {
  res.send("404 Not found");
});

app.listen(PORT, (err) => {
  err
    ? console.log("Ocurrión un error")
    : console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
