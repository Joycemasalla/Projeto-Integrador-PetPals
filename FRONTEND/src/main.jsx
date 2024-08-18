import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./Components/UserContext";

// Cria um contexto para gerenciar a autenticação do usuário
export const Context = createContext({
  isAuthenticated: false, // Estado inicial de autenticação (não autenticado)
});

const AppWrapper = () => {
  // Estado para gerenciar se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Estado para armazenar os dados do usuário
  const [user, setUser] = useState({});

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
