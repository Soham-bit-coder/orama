// Firebase removed - comments disabled
export const commentService = {
  async getComments() { return { comments: [], total: 0 }; },
  async createComment() { throw new Error('Auth disabled'); },
  async deleteComment() { throw new Error('Auth disabled'); },
  async toggleLike() { throw new Error('Auth disabled'); },
  async flagComment() { throw new Error('Auth disabled'); },
};
