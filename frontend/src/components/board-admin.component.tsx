import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const BoardAdmin: React.FC = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchAdminBoard = async () => {
      try {
        const response = await UserService.getAdminBoard();
        setContent(response.data);
      } catch (error: any) {
        setContent(
          error.response?.data?.message || error.message || error.toString()
        );

        if (error.response?.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    };

    fetchAdminBoard();
  }, []); // El array vacío asegura que el efecto se ejecuta solo al montar el componente

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default BoardAdmin;
