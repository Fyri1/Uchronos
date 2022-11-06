import Express from 'express';
import categorControl from "../controllers/categories-controller.js";

const router = Express.Router();


router.get("/", categorControl.AllCategoriesGet);// caregor 1
router.get("/:category_id", categorControl.CategoryDataGet);// caregor 2
router.get("/:category_id/posts", categorControl.AllPostsCategoryGet);// caregor 3
router.post("/", categorControl.createCategoryPost);// caregor 4
router.patch("/:category_id", categorControl.updateCategoryPatch);// caregor 5
router.delete("/:category_id", categorControl.deleteCategory);// caregor 6


export default router;
