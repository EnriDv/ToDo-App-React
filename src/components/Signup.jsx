import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signUpNewUser(email, password); // Call context function

      if (result.success) {
        navigate("/home"); // Navigate to dashboard on success
      } else {
        setError(result.error.message); // Show error message on failure
      }
    } catch (err) {
      setError("An unexpected error occurred."); // Catch unexpected errors
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0D0714] text-white px-4">
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-sm bg-[#1D1825] p-6 rounded-2xl shadow-lg space-y-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#9E78CF]">Crea tu cuenta</h2>
          <p className="text-sm text-white/70 mt-1">
            ¿Ya tienes cuenta?{" "}
            <Link to="/" className="text-[#9E78CF] hover:underline">
              Inicia sesión
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
          disabled={loading}
          className="w-full bg-[#9E78CF] text-[#0D0714] font-semibold py-3 rounded-lg hover:opacity-90 transition"
        >
          Registrarse
        </button>

        {error && (
          <p className="text-red-500 text-center text-sm pt-2">{error}</p>
        )}
      </form>
    </div>
  );
};

export default Signup;