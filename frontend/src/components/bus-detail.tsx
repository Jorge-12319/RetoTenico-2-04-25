import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthService from "../services/auth.service";

interface Bus {
  id: number;
  busNumber: string;
  licensePlate: string;
  features: string;
  active: boolean;
}

const BusDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bus, setBus] = useState<Bus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      setError("Usuario no autenticado. Por favor, inicia sesión.");
      return;
    }

    // Obtener información de un bus específico
    fetch(`http://localhost:8080/api/bus/${id}`, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener la información del bus");
        }
        return response.json();
      })
      .then((data) => setBus(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!bus) {
    return <div className="alert alert-info">Cargando información del bus...</div>;
  }

  return (
    <div className="container">
      <h2 className="my-3">Detalles del Bus</h2>
      <ul className="list-group">
        <li className="list-group-item">
          <strong>Número de Bus:</strong> {bus.busNumber}
        </li>
        <li className="list-group-item">
          <strong>Placa:</strong> {bus.licensePlate}
        </li>
        <li className="list-group-item">
          <strong>Características:</strong> {bus.features}
        </li>
        <li className="list-group-item">
          <strong>Estado:</strong> {bus.active ? "Activo" : "Inactivo"}
        </li>
      </ul>
    </div>
  );
};

export default BusDetail;
