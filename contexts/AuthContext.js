import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);



  async function signUp(email, password, data ) {
    return await auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setUserID(userCredential?.user.uid);
        setProfile(data);
      }).catch(error=> {
        console.log(error.message)
      });
  }

  const setProfile = async (data) => {
    
      await setDoc(doc(db, "users", userID), {
          email: data.email,
          name: data.name,
          userID: userID
        });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  // function resetPassword(email) {
  //   return auth.sendPasswordResetEmail(email);
  // }

  // function updateEmail(email) {
  //   return currentUser.updateEmail(email);
  // }

  // function updatePassword(password) {
  //   return currentUser.updatePassword(password);
  // }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signUp,
    logout,

  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
