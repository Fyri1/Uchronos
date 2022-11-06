
import express from "express";
import  userController  from "../controllers/user-controller.js";

const router = express.Router();

router.get("/",userController.getAllUsers);
router.get("/:user_id", userController.getDataUser);
router.post("/", userController.createNewUser);

router.patch("/avatar", userController.UserAvatar);
router.patch("/:user_id", userController.updateUser);
router.delete("/:user_id", userController.deleteUserOnId);


export default router;