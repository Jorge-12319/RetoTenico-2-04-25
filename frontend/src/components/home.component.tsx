import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";

const Home: React.FC = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await UserService.getPublicContent();
        setContent(response.data);
      } catch (error: any) {
        setContent(
          error.response?.data || error.message || error.toString()
        );
      }
    };

    fetchContent();
  }, []); // El array vacío asegura que esto solo se ejecuta una vez al montar el componente

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default Home;
