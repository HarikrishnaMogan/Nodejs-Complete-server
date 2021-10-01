const route = require("express").Router();
const service = require("../services/postsService");

route.get("/", service.findpost)

route.post("/", service.createpost )

route.put("/:id", service.updatepost )

route.delete("/:id", service.deletepost )

module.exports = route;