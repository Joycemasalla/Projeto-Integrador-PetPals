import  { useContext, useState, useEffect } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCalendarClear } from "react-icons/io5";
import { FaMoon, FaSun, FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigateTo = useNavigate();
  const location = useLocation(); // Hook para obter o caminho atual

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Função para alternar o tema
  function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme); // Salva o tema no localStorage
  }

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/user/admin/logout", {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setIsAuthenticated(false);
      navigateTo("/login"); // Redirecione para a página de login após o logout
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error logging out');
    }
  };

  const gotoHomePage = () => {
    navigateTo("/");
    setShow(!show);
  };
  const gotoDoctorsPage = () => {
    navigateTo("/doctors");
    setShow(!show);
  };
  const gotoMessagesPage = () => {
    navigateTo("/messages");
    setShow(!show);
  };
  const gotoAddNewDoctor = () => {
    navigateTo("/doctor/addnew");
    setShow(!show);
  };
  const gotoAddNewAdmin = () => {
    navigateTo("/admin/addnew");
    setShow(!show);
  };
  const gotoAddAvailability = () => {
    navigateTo("/admin/disponibilidade");
    setShow(!show);
  }

  return (
    <>
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          <TiHome 
            onClick={gotoHomePage} 
            className={location.pathname === '/' ? 'active' : ''}
          />
          <IoPersonAddSharp 
            onClick={gotoAddNewDoctor} 
            className={location.pathname === '/doctor/addnew' ? 'active' : ''}
          />
          <MdAddModerator 
            onClick={gotoAddNewAdmin} 
            className={location.pathname === '/admin/addnew' ? 'active' : ''}
          />
          <IoCalendarClear 
            onClick={gotoAddAvailability} 
            className={location.pathname === '/admin/disponibilidade' ? 'active' : ''}
          />
          <FaUserDoctor 
            onClick={gotoDoctorsPage} 
            className={location.pathname === '/doctors' ? 'active' : ''}
          />
          <AiFillMessage 
            onClick={gotoMessagesPage} 
            className={location.pathname === '/messages' ? 'active' : ''}
          />
          <RiLogoutBoxFill onClick={handleLogout} />
        </div>
        <div>
          <button className="themeToggleBtn btn" id="tema" onClick={toggleTheme}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </nav>
      <div
        className="wrapper"
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
