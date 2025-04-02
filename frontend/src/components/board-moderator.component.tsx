import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const BoardModerator: React.FC = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchModeratorBoard = async () => {
      try {
        const response = await UserService.getModeratorBoard();
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

    fetchModeratorBoard();
  }, []); // El array vacío asegura que se ejecuta solo una vez al montar el componente

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default BoardModerator;
