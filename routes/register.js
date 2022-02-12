"use strict";
const express = require("express");
const router = express.Router();
const mdlUsers = require("../models/mdlUsers");
const md5 = require("md5");

/*GET*/
router.get("/", (req, res) => {
  res.render("register");
});


/*POST*/
router.post("/", async (req, res) => {
  const hashedPass = await md5(req.body.pass);
  const data = {
    userName: req.body.user,
    email: req.body.email,
    userPass: hashedPass
  };
    await mdlUsers.addUser(data);
    res.redirect("/login");
  });

module.exports = router;