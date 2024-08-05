import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);

  console.log("doutores",doctors);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const calcularIdade = (dob) => {
    const dataaniversario = new Date(dob);
    const anoatual = new Date();
    let idade = anoatual.getFullYear() - dataaniversario.getFullYear();
    const diferencameses = anoatual.getMonth() - dataaniversario.getMonth();
    if (diferencameses < 0 || (diferencameses === 0 && anoatual.getDate() < dataaniversario.getDate())) {
      idade--;
    }
    return idade;
  };
  return (
    <section className="page doctors">
      <h1>DOUTORES</h1>
      <div className="banner">
        {doctors && doctors.length > 0 ? (
          doctors.map((element) => {
            return (
              <div className="card">
                <img
                  src={element.doctorAvatar && element.doctorAvatar.url}
                  alt="doctor avatar"
                />
                <h4>{`${element.firstName} ${element.lastName}`}</h4>
                <div className="details">
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Telefone: <span>{element.phone}</span>
                  </p>
                  <p>
                    Idade: <span>{calcularIdade(element.dob)}</span>
                  </p>
                  <p>
                    Departamento: <span>{element.doctorDepartment}</span>
                  </p>
                  <p>
                    NIC: <span>{element.nic}</span>
                  </p>
                  
                </div>
              </div>
            );
          })
        ) : (
          <h1>No Registered Doctors Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Doctors;
