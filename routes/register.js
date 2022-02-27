"use strict";
const express = require("express");
const router = express.Router();
const mdlUsers = require("../models/mdlUsers");
const { body, validationResult } = require('express-validator');
const md5 = require("md5");

/*GET*/
router.get("/", (req, res) => {
  res.render("register");
});

//MIDDLEWARE DE VALIDACIÓN
const validationRules = [
  body("user", "Debe ingresar un usuario válido").exists().isLength({ min: 3 }),
  body("email", "Debe ingresar un email válido").exists().isEmail(),
  body("pass", "Debe ingresar una contraseña válida").exists().isLength({ min: 3 }),
];



/*POST*/
router.post("/", validationRules, async (req, res) => {
  const errors = validationResult(req);
  const email = req.body.email;
  const hashedPass = await md5(req.body.pass);
  const data = {
    userName: req.body.user,
    email: req.body.email,
    userPass: hashedPass
  };
  const existingUser = await mdlUsers.existingUser(email);
 
  if (!errors.isEmpty()) {
    const formData = req.body;
    const arrWarnings = errors.array();
    res.render('register', { formData, arrWarnings });
  } else {
    if (existingUser != undefined) {
      const message = "Este usuario ya esta registrado";
      res.render("register", { message });
    } else {
      const msg = "Your registration has been successfull!"
      await mdlUsers.addUser(data);
      res.render("register", { msg });
    }

  }
});

module.exports = router;

