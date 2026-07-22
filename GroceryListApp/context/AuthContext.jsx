import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const updateProfileImage = async (newImageUri) => {
        if (user) {
            try {
                
                const userRef = firebase.firestore().collection('users').doc(user.uid);
                await userRef.update({ profilePic: newImageUri });

                
                setUser({ ...user, profilePic: newImageUri });
            } catch (error) {
                console.error('Error updating profile picture:', error);
            }
        }
    };

    const signup = async (email, password, username) => {
        try {
          // Create the user in Firebase
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          
          console.log('✅ Firebase user created successfully:', userCredential.user.uid);
          
          
          return { 
            success: true, 
            userId: userCredential.user.uid,
            email: email,
            username: username
          };
        } catch (error) {
          console.error("❌ Firebase signup error:", error);
          return { success: false, error: error.message };
        }
      };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, signup, logout, loading, updateProfileImage }}>
            {children}
        </AuthContext.Provider>
    );
};
