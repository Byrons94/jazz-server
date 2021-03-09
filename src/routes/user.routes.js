const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/users", controller.getAll);
  app.post("/api/users", controller.save);
  app.delete("/api/users/:id", controller.delete);
  app.get("/api/users/byEmail/:email", controller.getByEmail); 
  app.get("/api/users/id", [authJwt.verifyToken], controller.userBoard);

};