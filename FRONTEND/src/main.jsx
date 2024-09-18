import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./Components/UserContext";
import { useEffect } from "react";

// Cria um contexto para gerenciar a autenticação do usuário
export const Context = createContext({
  isAuthenticated: false, // Estado inicial de autenticação (não autenticado)
  user: {}
});

const AppWrapper = () => {
  // Estado para gerenciar se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true");
  // Estado para armazenar os dados do usuário
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );
  
  useEffect(() => {
    // Salva o estado de autenticação e dados do usuário no localStorage
    localStorage.setItem("isAuthenticated", isAuthenticated);
    localStorage.setItem("user", JSON.stringify(user));
  }, [isAuthenticated, user]); // Atualiza o localStorage sempre que o estado muda

  return (
    // O Context.Provider fornece os estados de autenticação e usuário para todos os componentes abaixo na árvore de componentes
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
      }}
    >
      {/* O UserProvider fornece o contexto do usuário com a lógica de salvar e carregar dados */}
      <UserProvider>
        <App />
      </UserProvider>
    </Context.Provider>
  );
};

// Renderiza a aplicação no elemento com ID "root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* AppWrapper contém todos os provedores de contexto e o componente App principal */}
    <AppWrapper />
  </React.StrictMode>
);
