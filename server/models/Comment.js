import client from '../db.js';
import ApiError from '../exceptions/api-error.js';

class Comment {
  async findCommentId(id) {
    const comment = await client('comments').select('*').where('id', '=', id);
    if (comment.length === 0) {
      throw ApiError.NotFound('Comment not found');
    }
    return comment[0];
  }
  async getAllCommentPost(id) {
    return await client('comments').select('*').where('post_id', '=', id);
  }
  async createComment(authorId, PostId, content) {
    try {
      const date = new Date();
      await client('comments').insert({
        author_id: authorId,
        post_id: PostId,
        publish_date: date,
        content,
      });
      const idComment = await client('comments')
        .select('id')
        .where('publish_date', '=', date);
      return idComment[0];
    } catch (err) {
      throw err;
    }
  }

  async deleteComment(idPost) {
    try {
      await client('comments').where('id', '=', idPost).del();
    } catch (err) {
      throw err;
    }
  }
  async updateComment(id, content) {
    try {
      await client('comments').where('id', '=', id).update({ content });
    } catch (err) {
      throw err;
    }
  }
}

export default new Comment();
