// Firebase removed - watchlist disabled
export const watchlistService = {
  async addToWatchlist() { throw new Error('Auth disabled'); },
  async removeFromWatchlist() { throw new Error('Auth disabled'); },
  async getWatchlist() { return []; },
  async isInWatchlist() { return false; },
  async getWatchlistCount() { return 0; },
};
