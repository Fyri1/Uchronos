import client from '../db.js';
import Category from './Category.js';
import User from './User.js';
import ApiError from '../exceptions/api-error.js';
import _ from 'lodash';

class Post {
  async getAllPosts(params) {
    const checkArray = !_.isArray(params.filter)
      ? [params.filter]
      : params.filter;
    const sortParams = !_.isEmpty(params) ? checkArray : '*';
    if (sortParams !== '*') {
      const sortPostId = sortParams.map(async (params) => {
        const category = await client('post_category')
          .select('id_post')
          .where('post_category.id_category', '=', params);
        return category;
      });
      const getPostId = await Promise.all(sortPostId);
      const posts = _.uniqWith(getPostId.flat(), _.isEqual);
      const newPosts = posts.map(async ({ id_post }) => {
        const post = await client('posts')
          .select('*')
          .where('id', '=', id_post);
        const user = await User.findUserId(post[0].author_id);
        return {
          ...post[0],
          author: user.login,
        };
      });
      const sortParamsPost = await Promise.all(newPosts);
      return sortParamsPost;
    }
    const posts = await client('posts').select('*');
    const newPosts = posts.map(async (post) => {
      const user = await User.findUserId(post.author_id);
      return {
        ...post,
        author: user.login,
      };
    });
    return Promise.all(newPosts);
  }

  async findPostId(id) {
    const post = await client('posts').select('*').where('id', '=', id);
    if (post.length === 0) {
      throw ApiError.NotFound('Post not found');
    }
    return post[0];
  }

  async getCategoriesPost(id) {
    const category = await client
      .select('id_category')
      .from('posts')
      .join('post_category', 'posts.id', 'post_category.id_post')
      .where('posts.id', '=', id);
    const categories = category.map((item) =>
      Category.findCategoryId(item['id_category'])
    );

    return await Promise.all(categories);
  }

  async isEqualTitlePost(title) {
    const isEmpty = await client('posts')
      .select('title')
      .where('title', '=', title);
    if (isEmpty.length !== 0) {
      throw ApiError.BadRequest('A post with that name already exists');
    }
  }

  async createPost(data) {
    try {
      const publishDate = new Date();
      await client('posts').insert({
        author_id: data.id,
        title: data.title,
        publish_date: publishDate,
        status: true,
        content: data.content,
        content_picture: data.picture || null,
      });
      const id = await client('posts')
        .select('id')
        .where('title', '=', data.title);
      return id[0];
    } catch (err) {
      throw err;
    }
  }
  async addCategoryPost(id_post, id_category) {
    Object.entries(id_category).forEach(async ([, value]) => {
      await client('post_category').insert({
        id_post,
        id_category: value,
      });
    });
  }

  async updateCategoryPost(id_post, id_category) {
    try {
      const oldCategory = await this.getCategoriesPost(id_post);
      const idOldCategory = oldCategory.map(({ id }) => id);

      const lengthUpdate = Object.keys(id_category).length;

      const idNewCategory = Object.values(id_category);

      if (_.isEqual(idNewCategory, idOldCategory)) {
        return;
      }
      const lengthOldCategory = oldCategory.length;

      if (lengthUpdate > lengthOldCategory) {
        const addCategory = idNewCategory.filter(
          (item) => !idOldCategory.includes(item)
        );
        addCategory.forEach(
          async (item) =>
            await client('post_category').insert({
              id_post,
              id_category: item,
            })
        );
      } else if (lengthUpdate < lengthOldCategory) {
        const delCategory = idOldCategory.filter(
          (item) => !idNewCategory.includes(item)
        );
        if (delCategory.length === lengthOldCategory) {
          idNewCategory.forEach(
            async (item) =>
              await client('post_category').insert({
                id_post,
                id_category: item,
              })
          );
        }
        delCategory.forEach(
          async (item) =>
            await client('post_category')
              .where('id_post', '=', id_post)
              .andWhere('id_category', '=', item)
              .del()
        );
      } else {
        const category = idNewCategory.filter(
          (item) => !idOldCategory.includes(item)
        );
        const updateCategory = idOldCategory.filter(
          (item) => !idNewCategory.includes(item)
        );
        await client('post_category')
          .where('id_post', '=', id_post)
          .andWhere('id_category', '=', updateCategory[0])
          .update({
            id_category: category[0],
          });
      }
    } catch (err) {
      throw err;
    }
  }
  async updatePost(data) {
    try {
      await client('posts').where('id', '=', data.id).update({
        title: data.title,
        content: data.content,
        content_picture: data.picture,
      });
    } catch (err) {
      throw err;
    }
  }
  async deletePost(idPost) {
    try {
      await client('posts').where('id', '=', idPost).del();
    } catch (err) {
      throw err;
    }
  }
}

export default new Post();
