import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../services/auth.service";

const Register: React.FC = () => {
  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "The username must be between 3 and 20 characters.")
      .max(20, "The username must be between 3 and 20 characters.")
      .required("This field is required!"),
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
    password: Yup.string()
      .min(6, "The password must be between 6 and 40 characters.")
      .max(40, "The password must be between 6 and 40 characters.")
      .required("This field is required!"),
  });

  const handleRegister = async (formValue: {
    username: string;
    email: string;
    password: string;
  }) => {
    const { username, email, password } = formValue;
  
    setMessage(""); // Limpiar mensajes anteriores
    setSuccessful(false); // Resetear estado exitoso
  
    try {
      const response = await AuthService.register(username, email, password);
  
      // Verificar que la respuesta contenga 'message'
      if (response && response.message) {
        setMessage(response.message);
        setSuccessful(true);
      } else {
        setMessage("Registration succeeded, but no message provided.");
        setSuccessful(true);
      }
    } catch (error: any) {
      // Registrar el objeto de error para depuración
      console.error("Error capturado durante el registro:", error);
  
      const resMessage =
        error.response?.data?.message || // Intentar obtener 'message' del backend
        error.response?.data ||         // Fallback si 'message' no existe
        error.message ||                // Error genérico
        "Error inesperado. Por favor, inténtalo nuevamente."; // Fallback final
  
      setMessage(resMessage);
      setSuccessful(false);
    }
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form>
            {!successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Field name="username" type="text" className="form-control" />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign Up
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className="form-group">
                <div
                  className={
                    successful ? "alert alert-success" : "alert alert-danger"
                  }
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
