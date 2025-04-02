import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import IUser from "./types/user.type";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";

import EventBus from "./common/EventBus";
import BusList from "./components/buslist";
import BusDetail from "./components/bus-detail";

const App: React.FC = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = () => {
      const user = AuthService.getCurrentUser();
      if (user) {
        setUserState(user);
      }
      setLoading(false);
    };

    initializeUser();

    const updateUser = (event: any) => {
      const user = event.detail;
      if (user) {
        setUserState(user);
      }
    };

    EventBus.on("userUpdated", updateUser);

    const logoutListener = () => {
      logOut();
    };

    EventBus.on("logout", logoutListener);

    return () => {
      EventBus.remove("userUpdated", updateUser);
      EventBus.remove("logout", logoutListener);
    };
  }, []);

  const setUserState = (user: IUser) => {
    setCurrentUser(user);
    setShowModeratorBoard(user.roles?.includes("ROLE_MODERATOR") || false);
    setShowAdminBoard(user.roles?.includes("ROLE_ADMIN") || false);
  };

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(null);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">RetoTecnico</Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">Home</Link>
          </li>

          {showModeratorBoard && (
            <li className="nav-item">
              <Link to={"/mod"} className="nav-link">Moderator Board</Link>
            </li>
          )}

          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">Admin Board</Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link">User</Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">{currentUser.username}</Link>
            </li>
            <li className="nav-item">
              <Link to={"/buses"} className="nav-link">Buses</Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>LogOut</a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">Login</Link>
            </li>
            <li className="nav-item">
              <Link to={"/register"} className="nav-link">Sign Up</Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user" element={<BoardUser />} />
          <Route path="/mod" element={<BoardModerator />} />
          <Route path="/admin" element={<BoardAdmin />} />
          <Route path="/buses" element={<BusList />} />
          <Route path="/bus/:id" element={<BusDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
