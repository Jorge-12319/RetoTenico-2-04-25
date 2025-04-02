import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

interface Bus {
  id: number;
  busNumber: string;
  licensePlate: string;
  features: string;
  active: boolean;
}

const BusList: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // Página actual
  const itemsPerPage = 10; // Elementos por página

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      setError("Usuario no autenticado. Por favor, inicia sesión.");
      return;
    }

    // Obtener la lista de buses
    fetch("http://localhost:8080/api/bus", {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener la lista de buses");
        }
        return response.json();
      })
      .then((data) => setBuses(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = buses.slice(indexOfFirstItem, indexOfLastItem);


  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h2 className="my-3">Lista de Buses</h2>
      <table className="table table-dark table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Número de Bus</th>
            <th>Placa</th>
            <th>Características</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((bus, index) => (
            <tr key={bus.id}>
              <td>{index + 1 + indexOfFirstItem}</td>
              <td>
                <Link to={`/bus/${bus.id}`}>{bus.busNumber}</Link>
              </td>
              <td>{bus.licensePlate}</td>
              <td>{bus.features}</td>
              <td>{bus.active ? "Activo" : "Inactivo"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de paginación */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from(
            { length: Math.ceil(buses.length / itemsPerPage) },
            (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default BusList;
