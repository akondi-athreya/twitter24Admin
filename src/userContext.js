import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [USERID, setUserId] = useState(localStorage.getItem("USERID") || "");
    const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin") === "true");

    const login = (userId) => {
        setUserId(userId);
        setIsLogin(true);
        localStorage.setItem("USERID", userId);
        localStorage.setItem("isLogin", "true");
    };

    const logout = () => {
        setUserId("");
        setIsLogin(false);
        localStorage.removeItem("USERID");
        localStorage.removeItem("isLogin");
    };

    return (
        <UserContext.Provider value={{ USERID, setUserId, isLogin, setIsLogin, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};