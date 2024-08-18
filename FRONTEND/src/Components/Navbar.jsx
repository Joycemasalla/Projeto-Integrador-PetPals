import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendarDay, FaMoon, FaSun } from "react-icons/fa";

import { Context } from "../main";
import { logo, setaparacima } from "../assets";
import './Navbar.css';

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  // Check for the theme in localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/user/paciente/logout", {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setIsAuthenticated(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error logging out');
    }
  };

  const goToLogin = () => {
    navigateTo("/login");
  };

  function backToTop() {
    document.documentElement.scrollTop = 0;
  }

  // Função para alternar o tema
  function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.body.setAttribute('data-theme', newTheme);
  }




  // Exemplo de uso
  const themeButton = document.getElementById('theme-toggle-button');
  if (themeButton) {
    themeButton.addEventListener('click', toggleTheme);
  }



  return (
    <>
      <div id="voltarTopo">
        <button onClick={backToTop} id="subir">
          <img src={setaparacima} alt="Voltar ao topo" />
        </button>
      </div>
      <nav className="container">
        <div className="logo">
          <Link to={"/"} onClick={() => setShow(!show)}>
            <img src={logo} alt="logo" className="logo-img" />
          </Link>
        </div>

        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link to={"/"} onClick={() => setShow(!show)}>
              Início
            </Link>
            <Link to={"/appointment"} onClick={() => setShow(!show)}>
              Agendamento
            </Link>
            <Link to={"/about"} onClick={() => setShow(!show)}>
              Sobre
            </Link>
          </div>
          <div className="agendamento">
            <Link to={"/agendamentos"}>
              <FaCalendarDay />
            </Link>
          </div>
          {isAuthenticated ? (
            <button className="logoutBtn btn" onClick={handleLogout}>
              LOGOUT
            </button>
          ) : (
            <button className="loginBtn btn" onClick={goToLogin}>
              LOGIN
            </button>
          )}
          <button className="themeToggleBtn btn" onClick={toggleTheme}>
            {isDarkMode ? <FaMoon/> : <FaSun/>}
          </button>
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
