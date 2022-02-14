"use strict";
const express = require("express");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const nodemailer = require("nodemailer");


// get
router.get("/", (req, res) => {
    res.render("contacto");
});

//MIDDLEWARE DE VALIDACIÓN
const validationRules = [
    body("name", "Debe ingresar su nombre").exists().isLength({ min: 2 }),
    body("lastName", "Debe ingresar su apellido").exists().isLength({ min: 2 }),
    body("email", "Debe ingresar un email válido").exists().isEmail(),
    body("message", "Su mensaje debe contener entre 10 y 300 caracteres").exists().isLength({ min: 10, max: 300 } ),
  ];

/*POST*/
router.post("/", validationRules, async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formData = req.body;
        const arrWarnings = errors.array();
        res.render('contacto', { formData, arrWarnings });
    } else {

    const emailMsg = {
        to: "atencioncliente@argenwines.com",
        from: req.body.email,
        subject: "Mensaje desde formulario de contacto",
        html: `${req.body.name} ${req.body.lastName} envió el siguiente mensaje: ${req.body.message}`,
    };

    const transport = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.PASS,
        },
    });

    let sendMailStatus = await transport.sendMail(emailMsg);
    let statusMessage = "";
    if (sendMailStatus.rejected.length) {
        statusMessage = "No pudimos enviar. Intente de nuevo. 🥵";
    } else {
        statusMessage = "Mensaje envíado. 😁";
    }

    
    res.render("contacto", {
        statusMessage,
    });
    }
});

module.exports = router;
