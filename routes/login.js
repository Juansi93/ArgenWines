"use strict";
const express = require("express");
const router = express.Router();
const mdlUsers = require("../models/mdlUsers");

/*GET*/
router.get("/", (req, res) => {
  res.render("login");
});


/*GET*/
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });

/*POST*/
router.post("/", async (req, res) => {
    const { user, pass } = req.body;
    const data = await mdlUsers.getUser(user, pass);
    if (data != undefined) {
      req.session.user = user;
      res.render("secret", { user });
    } else {
      const message = "Usuario o Contraseña Incorrectos";
      res.render("login", { message });
    }
  });

module.exports = router;
