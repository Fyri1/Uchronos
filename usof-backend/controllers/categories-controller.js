import Category from "../models/Category.js";
import Post from "../models/Post.js";


class CategoriesController {
    async AllCategoriesGet (req, res, next) {
        try {
            const data = await Category.CategoriesListGet();

            res.status(200);
            res.json({ message: "Got categories list!", postsList: data });

        } catch (e) {
        
            console.log("ERROR AllCategoriesGet (caregor_1) " + e);

            next(e);
        }
    }
    async CategoryDataGet (req, res, next) {
        try {
            const { category_id } = req.params;

            const data = await Category.CategoryDataArrDB("id", category_id);

            res.status(200);
            res.json({ message: "Got category data!", postsList: data });

        } catch (e) {
          
            console.log("PIZDA CATEGORY CONTROLLERY getCategoryData " + e);

            next(e);
        }
    }
    async AllPostsCategoryGet (req, res, next) {
        try {
            const { category_id } = req.params;

            const data = await Post.PostData("categories_id", [category_id]);

            res.status(200);
            res.json({ message: "Got posts list for provided category!", postsList: data });

        } catch (e) {
       
            console.log("PIZDA CATEGORY CONTROLLERY getAllPostsForCategory " + e);

            next(e);
        }
    }
    async createCategoryPost (req, res, next) {
        try {
            await Category.CategoryAdd(req.body);

            res.status(200);
            res.json({ message: "Created category!!"});

        } catch (e) {
          
            console.log("PIZDA CATEGORY CONTROLLERY createCategory: " + e);

            next(e);
        }
    }
    async updateCategoryPatch (req, res, next) {
        try {
            const { category_id } = req.params;
     

            await Category.CategoryData(req.body, category_id);

            res.status(200);
            res.json({ message: "Updated category!!"});

        } catch (e) {
      
            console.log("PIZDA CATEGORY CONTROLLERY updateCategory: " + e);

            next(e);
        }
    }
    async deleteCategory (req, res, next) {
        try {
            const { category_id } = req.params;

            await Category.deleteCategory(category_id);

            res.status(200);
            res.json({ message: "Deleted category!!"});

        } catch (e) {
            
            console.log("PIZDA CATEGORY CONTROLLERY deleteCategory: " + e);

            next(e);
        }
    }



}
export default new CategoriesController();