import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  count as getFirestoreCount
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const watchlistService = {
  async addToWatchlist(userId, mediaId, mediaType, title, posterPath, voteAverage) {
    try {
      // Document reference: /users/{userId}/watchlist/{mediaType}_{mediaId}
      const itemRef = doc(db, "users", userId, "watchlist", `${mediaType}_${mediaId}`);
      
      const payload = {
        userId,
        mediaId: parseInt(mediaId),
        mediaType,
        title,
        posterPath,
        voteAverage: parseFloat(voteAverage || 0),
        addedAt: new Date().toISOString(),
      };

      await setDoc(itemRef, payload);
      return payload;
    } catch (error) {
      console.error("Error adding to watchlist Firestore:", error);
      throw error;
    }
  },

  async removeFromWatchlist(userId, mediaId, mediaType) {
    try {
      const itemRef = doc(db, "users", userId, "watchlist", `${mediaType}_${mediaId}`);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error("Error removing from watchlist Firestore:", error);
      throw error;
    }
  },

  async getWatchlist(userId) {
    try {
      const watchlistRef = collection(db, "users", userId, "watchlist");
      const q = query(watchlistRef, orderBy("addedAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching watchlist Firestore:", error);
      throw error;
    }
  },

  async isInWatchlist(userId, mediaId, mediaType) {
    try {
      const itemRef = doc(db, "users", userId, "watchlist", `${mediaType}_${mediaId}`);
      const docSnap = await getDoc(itemRef);
      return docSnap.exists();
    } catch (error) {
      console.error("Error checking isInWatchlist Firestore:", error);
      return false;
    }
  },

  async getWatchlistCount(userId) {
    try {
      const watchlistRef = collection(db, "users", userId, "watchlist");
      const snapshot = await getDocs(query(watchlistRef));
      return snapshot.size;
    } catch (error) {
      console.error("Error getting watchlist count Firestore:", error);
      return 0;
    }
  },
};
