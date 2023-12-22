const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth");

router.get("/users", authControllers.getUsers);
router.post("/sign-up", authControllers.signUp);
router.post("/sign-in", authControllers.login);

module.exports = router;