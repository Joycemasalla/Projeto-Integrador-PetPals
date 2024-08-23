import React, { createContext, useState, useEffect } from 'react';

// Criar o contexto
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Recuperar os dados do localStorage quando o componente for montado
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    const saveUserData = (data) => {
        setUserData(data);
        localStorage.setItem('userData', JSON.stringify(data));
    };

    return (
        <UserContext.Provider value={{ userData, saveUserData }}>
            {children}
        </UserContext.Provider>
    );
};