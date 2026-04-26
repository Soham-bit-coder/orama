import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  limit as firestoreLimit,
  startAfter,
  arrayUnion,
  arrayRemove,
  increment
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const commentService = {
  async getComments(mediaId, mediaType, userId, parentId = null, page = 1, limit = 10, season, episode) {
    try {
      const qConstraints = [
        where("mediaId", "==", String(mediaId)),
        where("mediaType", "==", mediaType),
        where("parentId", "==", parentId)
      ];

      if (season) qConstraints.push(where("season", "==", parseInt(season)));
      if (episode) qConstraints.push(where("episode", "==", parseInt(episode)));

      qConstraints.push(orderBy("createdAt", "desc"));
      qConstraints.push(firestoreLimit(limit));

      // Handle pagination (simplified with startAfter needs the actual document snapshot)
      // For simplicity in this first pass, we'll fetch top N and slice
      const q = query(collection(db, "comments"), ...qConstraints);
      const querySnapshot = await getDocs(q);

      const comments = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const likes = data.likes || [];
          
          return {
            id: docSnap.id,
            ...data,
            isLiked: userId ? likes.includes(userId) : false,
            _count: { likes: likes.length },
            // Basic reply handling (recursive call for nested can be expensive, standard practice is one-deep)
            replies: [] // Standard getComments for thread usually doesn't fetch sub-replies at same time
          };
        })
      );

      // In real Firestore apps, we'd use getCountFromServer() or a cached counter
      return { comments, total: querySnapshot.size };
    } catch (error) {
      console.error("Firestore getComments error:", error);
      throw error;
    }
  },

  async createComment({ userId, username, mediaId, mediaType, content, parentId, season, episode }) {
    try {
      const payload = {
        userId,
        username, // Storing for convenience
        mediaId: String(mediaId),
        mediaType,
        content,
        parentId: parentId || null,
        season: season ? parseInt(season) : null,
        episode: episode ? parseInt(episode) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: [],
        flagged: false,
      };

      const docRef = await addDoc(collection(db, "comments"), payload);
      return { id: docRef.id, ...payload, isLiked: false, _count: { likes: 0 } };
    } catch (error) {
      console.error("Firestore createComment error:", error);
      throw error;
    }
  },

  async deleteComment(commentId, userId) {
    try {
      const docRef = doc(db, "comments", commentId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists() || docSnap.data().userId !== userId) {
        throw new Error('Not authorized to delete this comment');
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error("Firestore deleteComment error:", error);
      throw error;
    }
  },

  async toggleLike(commentId, userId) {
    try {
      const docRef = doc(db, "comments", commentId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      const likes = data.likes || [];
      const liked = likes.includes(userId);

      if (liked) {
        await updateDoc(docRef, {
          likes: arrayRemove(userId)
        });
        return { liked: false };
      } else {
        await updateDoc(docRef, {
          likes: arrayUnion(userId)
        });
        return { liked: true };
      }
    } catch (error) {
      console.error("Firestore toggleLike error:", error);
      throw error;
    }
  },

  async flagComment(commentId, reason) {
    try {
      const docRef = doc(db, "comments", commentId);
      await updateDoc(docRef, {
        flagged: true,
        flagReason: reason,
        flaggedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Firestore flagComment error:", error);
      throw error;
    }
  },
};
