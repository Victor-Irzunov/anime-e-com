"use client"
import { createContext, useState, useEffect } from 'react';
import UserStore from '@/store/UserStore';
import DataStore from '@/store/DataStore';
import { dataUser } from '@/http/userAPI';
const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const [isState, setIsState] = useState(false);
  const [user] = useState(new UserStore())
  const [dataApp] = useState(new DataStore())

  const updateState = () => {
    setIsState(i => !i);
  };

  useEffect(() => {
    dataUser()
      .then(data => {
        user.setUserData(data)
        if (data) {
          user.setIsAuth(true)
          user.setUser(true)
        }
      })
      .catch(data => {
        console.log('🚀 🚀 🚀dataUser err:', data)
      })
  }, [user])


  useEffect(() => {
    // if (typeof window !== "undefined") {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    dataApp.setDataKorzina(cartData)
    // }
  }, [isState]);


  return (
    <MyContext.Provider value={{ isState, updateState, user, dataApp }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
