import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { session, error } = await signInUser(email, password); // Use your signIn function

    if (error) {
      setError(error); // Set the error message if sign-in fails

      // Set a timeout to clear the error message after a specific duration (e.g., 3 seconds)
      setTimeout(() => {
        setError("");
      }, 3000); // 3000 milliseconds = 3 seconds
    } else {
      // Redirect or perform any necessary actions after successful sign-in
      navigate("/home");
    }

    if (session) {
      setError(""); // Reset the error when there's a session
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0D0714] text-white px-4">
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-sm bg-[#1D1825] p-6 rounded-2xl shadow-lg space-y-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#9E78CF]">Inicia sesión</h2>
          <p className="text-sm text-white/70 mt-1">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-[#9E78CF] hover:underline">
              Regístrate
            </Link>
          </p>
        </div>

        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          id="email"
          placeholder="Correo electrónico"
          className="w-full p-3 rounded-lg bg-[#0D0714] text-white border border-[#9E78CF] placeholder-white/40 focus:outline-none"
          required
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          id="password"
          placeholder="Contraseña"
          className="w-full p-3 rounded-lg bg-[#0D0714] text-white border border-[#9E78CF] placeholder-white/40 focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#9E78CF] text-[#0D0714] font-semibold py-3 rounded-lg hover:opacity-90 hover:cursor-pointer transition"
        >
          Iniciar sesión
        </button>

        {error && (
          <p className="text-red-500 text-center text-sm pt-2">{error}</p>
        )}
      </form>
    </div>

  );
};

export default Signin;