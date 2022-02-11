"use strict";
const express = require("express");
const router = express.Router();
const mdlUsers = require("../models/mdlUsers");

/*GET*/
router.get("/", (req, res) => {
  res.render("register");
});


/*POST*/
router.post("/", async (req, res) => {
  const data = {
    userName: req.body.user,
    email: req.body.email,
    userPass: req.body.pass
  };
    await mdlUsers.addUser(data);
    res.redirect("/login");
  });

module.exports = router;