const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// CRUD
router.post("/register", userController.createUser);
router.get("/profile/:id", userController.getUser);
router.put("/profile/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// List (Admin)
router.get("/", userController.listUsers);

module.exports = router;
