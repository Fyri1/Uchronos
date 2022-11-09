import client from '../db.js';
import ApiError from '../exceptions/api-error.js';

class Like {
  async createLikePost(postId, authorId) {
    const date = new Date();
    await client('like_post').insert({
      id_post: postId,
      author_id: authorId,
      publish_date: date,
      type: true,
    });
  }
  async createLikeComment(postId, authorId) {
    const date = new Date();
    await client('like_comments').insert({
      id_comment: postId,
      author_id: authorId,
      publish_date: date,
      type: true,
    });
  }

  async getLikeCommentById(id) {
    return await client('like_comments').where('id', '=', id);
  }

  async getPostLike(id) {
    return await client('like_post').where('id_post', '=', id);
  }
  async getCommentLike(id) {
    return await client('like_comments').where('id_comment', '=', id);
  }
  async deteleLikePost(post_id, author_id) {
    try {
      await client('like_post')
        .where('id_post', '=', post_id)
        .andWhere('author_id', '=', author_id)
        .del();
    } catch (err) {
      throw err;
    }
  }
  async deteleLikeComment(id_comment, author_id) {
    try {
      await client('like_comments')
        .where('id_comment', '=', id_comment)
        .andWhere('author_id', '=', author_id)
        .del();
    } catch (err) {
      throw err;
    }
  }
}

export default new Like();
