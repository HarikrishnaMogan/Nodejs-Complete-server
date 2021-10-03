const route = require("express").Router();
const service = require("../services/usersService");

route.post("/register",service.register);
route.post("/login",service.login);
route.get("/verify/:id",service.verifyUser);


module.exports = route;

