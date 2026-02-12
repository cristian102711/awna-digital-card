import React, { useState } from 'react';
import './App.css'; 

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulación de API
    setTimeout(() => {
      if (email === "admin@awna.cl" && password === "1234") {
        onLoginSuccess(); 
      } else {
        setError("Credenciales incorrectas.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="login-container">
      
      {/* --- LADO IZQUIERDO: VIDEO DE FONDO --- */}
      <div className="login-brand-side">
        {/* Aquí está la magia: El Video */}
        <div className="video-background-container">
            <video autoPlay loop muted playsInline className="video-bg">
                {/* He puesto un video parecido al de Awna (Dark Liquid) */}
                <source src="https://awna.s3.sa-east-1.amazonaws.com/Awna_+metaball_+anim_+3_+blur.mp4" type="video/mp4"/>
                Tu navegador no soporta videos.
            </video>
            {/* Overlay oscuro para que el texto resalte sobre el video */}
            <div className="video-overlay"></div>
        </div>

        <div className="brand-overlay">
          <h1>Awna Global</h1>
          <p>Impulsando la transformación digital con estrategias 360°.</p>
        </div>
      </div>

      {/* --- LADO DERECHO: FORMULARIO (Igual que antes) --- */}
      <div className="login-form-side">
        <div className="form-wrapper">
          <div className="logo-placeholder">🌊</div> 
          <h2>Bienvenido</h2>
          <p className="subtitle">Ingresa a tu panel de control</p>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-block">
              <label>Email Corporativo</label>
              <input 
                type="email" 
                placeholder="nombre@awna.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? 'input-error' : ''}
              />
            </div>

            <div className="input-block">
              <label>Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? 'input-error' : ''}
              />
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : "Ingresar"}
            </button>
          </form>

          <div className="demo-hint">
            <p>Demo: admin@awna.cl / 1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;