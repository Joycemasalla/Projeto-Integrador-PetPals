import  { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendarDay, FaMoon, FaSignOutAlt, FaSun, FaUser } from "react-icons/fa";
import { Context } from "../main";
import { logo, setaparacima } from "../assets";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation(); // Hook para obter o caminho atual

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

  function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme); // Salva o tema no localStorage
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
          <Link to="/" onClick={() => setShow(!show)}>
            <img src={logo} alt="logo" className="logo-img" />
          </Link>
        </div>

        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link
              to="/"
              onClick={() => setShow(!show)}
              className={location.pathname === '/' ? 'active' : ''}
            >
              Início
            </Link>
            <Link
              to="/appointment"
              onClick={() => setShow(!show)}
              className={location.pathname === '/appointment' ? 'active' : ''}
            >
              Agendamento
            </Link>
            <Link
              to="/servicos"
              onClick={() => setShow(!show)}
              className={location.pathname === '/servicos' ? 'active' : ''}
            >
              Serviços
            </Link>
            <Link
              to="/about"
              onClick={() => setShow(!show)}
              className={location.pathname === '/about' ? 'active' : ''}
            >
              Sobre
            </Link>
          </div>
          <div className="iconesmenu">
            <div className="agendamento btn">
              <Link to="/agendamentos" title="Ver Agendamentos">
                <FaCalendarDay />
              </Link>
            </div>
            {isAuthenticated ? (
              <button className="logoutBtn btn" onClick={handleLogout} title="Sair">
                <FaSignOutAlt />
              </button>
            ) : (
              <button className="loginBtn btn" onClick={goToLogin} title="Login">
                <FaUser />
              </button>
            )}
            <button className="themeToggleBtn btn" onClick={toggleTheme} title="Trocar Tema">
              {isDarkMode ? <FaSun /> : <FaMoon /> }
            </button>
          </div>
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
