import { collection, addDoc, query, orderBy, limit, getDocs, startAfter, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { analyzeAnimal } from './gemini';

/**
 * AnimalService provides an abstraction over AI analysis and data persistence.
 * Adheres to DIP by providing a unified interface for the UI.
 */
export const AnimalService = {
  async performAnalysis(base64Image, mimeType) {
    const analysis = await analyzeAnimal(base64Image, mimeType);
    const result = {
      ...analysis,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, "animals"), result);
    return { id: docRef.id, ...result };
  },

  async getHistory(lastDoc = null, pageSize = 10) {
    let q = query(
      collection(db, "animals"),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        collection(db, "animals"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return {
      docs,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: docs.length === pageSize
    };
  }
};
