  import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from '../config/firebase';
  import { headphones } from '../data/headphones';
  
  const COLLECTION_NAME = 'headphones';
  
  export const headphonesService = {
    // Create a new headphone
    async createHeadphone(headphoneData) {
      try {
        console.log('Attempting to create headphone:', headphoneData);
        
        // Ensure we have a valid user ID (allow system user)
        if (!headphoneData.userId && headphoneData.userId !== 'system') {
          throw new Error('User ID is required');
        }
        
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
          ...headphoneData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('Document created with ID:', docRef.id);
        return { id: docRef.id, ...headphoneData };
      } catch (error) {
        console.error('Error creating headphone:', error);
        throw error;
      }
    },
  
    // Get all headphones
    async getAllHeadphones() {
      try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.warn('Firebase Firestore access denied. Please check security rules:', error.message);
        throw error;
      }
    },
  
    // Get headphones by user
    async getHeadphonesByUser(userId) {
      try {
        // Remove orderBy to avoid composite index requirement
        const q = query(
          collection(db, COLLECTION_NAME),
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort in JavaScript instead of Firestore to avoid index requirement
        return results.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(0);
          const bTime = b.createdAt?.toDate?.() || new Date(0);
          return bTime - aTime; // desc order
        });
      } catch (error) {
        console.error('Error fetching user headphones:', error);
        throw error;
      }
    },
  
    // Update a headphone
    async updateHeadphone(id, updates) {
      try {
        const headphoneRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(headphoneRef, {
          ...updates,
          updatedAt: new Date()
        });
        return { id, ...updates };
      } catch (error) {
        console.error('Error updating headphone:', error);
        throw error;
      }
    },
  
    // Delete a headphone
    async deleteHeadphone(id) {
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return id;
      } catch (error) {
        console.error('Error deleting headphone:', error);
        throw error;
      }
    },




    // Get user's headphones only
    async getUserHeadphones(userId) {
      try {
        const q = query(
          collection(db, COLLECTION_NAME),
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching user headphones:', error);
        return [];
      }
    }
  };