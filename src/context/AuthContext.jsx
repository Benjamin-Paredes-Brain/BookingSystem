import { createContext, useEffect, useState } from "react";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, provider, db } from "../firebase/config.js";
import { ref, get } from "firebase/database";


export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    logged: false,
    email: null,
    name: null,
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);

  const googleLogin = () => {
    signInWithPopup(auth, provider);
  };

  const googleSignOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const userRolesRef = ref(db, `rol/admin/${userAuth.uid}`);
        const snapshot = await get(userRolesRef);

        setUser({
          logged: true,
          email: userAuth.email,
          name: userAuth.displayName,
          isAdmin: snapshot.exists(),
        });
      } else {
        setUser({
          logged: false,
          email: null,
          isAdmin: false,
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <AuthContext.Provider value={{ user, googleLogin, googleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};
