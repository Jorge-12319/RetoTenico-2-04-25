import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const BoardUser: React.FC = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchUserBoard = async () => {
      try {
        const response = await UserService.getUserBoard();
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

    fetchUserBoard();
  }, []); // El array vacío asegura que el efecto se ejecute solo al montar el componente

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default BoardUser;
