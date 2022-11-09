import client from '../db.js';
import Post from './Post.js';
import ApiError from '../exceptions/api-error.js';

class Category {
  async getAllCategory() {
    return await client('categories').select('*');
  }
  async findCategoryId(id) {
    const post = await client('categories').select('*').where('id', '=', id);
    if (post.length === 0) {
      throw ApiError.NotFound('Category not found');
    }
    return post[0];
  }
  async isEqualCategory(title) {
    const category = await client('categories')
      .select('*')
      .where('title', '=', title);
    return category.length !== 0;
  }
  async saveCategory(category) {
    try {
      await client('categories').insert({
        title: category.title,
        description: category.description,
      });
      const post = await client('categories')
        .select('*')
        .where('title', '=', category.title);
      return post;
    } catch (err) {
      throw err;
    }
  }

  async updateCategory(id, { title, description }) {
    try {
      await client('categories')
        .update({
          title,
          description,
        })
        .where('id', '=', id);
    } catch (err) {
      throw err;
    }
  }
  async deleteCategory(id) {
    try {
      await client('categories').where('id', '=', id).del();
    } catch (err) {
      throw err;
    }
  }
  async getAllPostByCategoryId(categoryId) {
    const category = await client
      .select('posts.id')
      .from('posts')
      .join('post_category', 'posts.id', 'post_category.id_post')
      .where('post_category.id_category', '=', categoryId);
    const categories = category.map((item) => Post.findPostId(item.id));

    return await Promise.all(categories);
  }
}

export default new Category();
