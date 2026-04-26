"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          setState({
            isAuthenticated: true,
            user: {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              username: userData.username || firebaseUser.displayName || 'User',
              ...userData
            },
            loading: false,
            error: null,
          });
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          setState({
            isAuthenticated: true,
            user: {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              username: firebaseUser.displayName || 'User',
            },
            loading: false,
            error: null,
          });
        }
      } else {
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (identifier, password) => {
    try {
      setState(s => ({ ...s, loading: true, error: null }));
      
      let email = identifier;
      
      // If identifier doesn't look like an email, try looking it up as a username in Firestore
      if (!identifier.includes('@')) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", identifier));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw { code: 'auth/user-not-found' };
        }
        
        email = querySnapshot.docs[0].data().email;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Create session cookie via API
      const idToken = await userCredential.user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      return true;
    } catch (error) {
      let errorMsg = "Login failed";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = "Invalid username/email or password";
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = "Invalid email format";
      }
      
      setState(s => ({
        ...s,
        error: errorMsg,
        loading: false,
      }));
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      setState(s => ({ ...s, loading: true, error: null }));
      
      // 1. Check if username is already taken in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw { code: 'auth/username-taken' };
      }

      // 2. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Update Firebase Auth Profile
      await updateProfile(user, { displayName: username });

      // 4. Create entry in Firestore 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
        role: 'user'
      });

      // 5. Create session cookie via API
      const idToken = await user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      return true;
    } catch (error) {
      let errorMsg = "Registration failed";
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = "Email already in use";
      } else if (error.code === 'auth/weak-password') {
        errorMsg = "Password is too weak";
      } else if (error.code === 'auth/username-taken') {
        errorMsg = "Username is already taken";
      }
      
      setState(s => ({
        ...s,
        error: errorMsg,
        loading: false,
      }));
      return false;
    }
  };

  const logout = async () => {
    try {
      setState(s => ({ ...s, loading: true }));
      await signOut(auth);
      await fetch('/api/auth/session', { method: 'DELETE' });
      return true;
    } catch (error) {
      console.error("Sign out error:", error);
      return false;
    }
  };

  const clearError = () => {
    setState(s => ({ ...s, error: null }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
