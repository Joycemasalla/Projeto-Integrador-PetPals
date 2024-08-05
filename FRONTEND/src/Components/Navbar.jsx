import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendarDay} from "react-icons/fa";

import { Context } from "../main";
import { logo, setaparacima } from "../assets";
import './Navbar.css'
import Agendamentos from "./Agendamentos";


const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const handleLogout = async () => {
    await axios
      .get("http://localhost:4000/api/v1/user/paciente/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const navigateTo = useNavigate();

  const goToLogin = () => {
    navigateTo("/login");
  };
  function backToTop() {
    document.documentElement.scrollTop = 0;
  }


  return (
    <>
      <div id="voltarTopo">
        <button onClick={backToTop} id="subir">
          <img src={setaparacima} alt="Voltar ao topo" />
        </button>
      </div>
      <nav className={"container"}>
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
           <Link to={"/agendamentos"}> <FaCalendarDay/> </Link>
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
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
