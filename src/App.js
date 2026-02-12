import React, { useState, useRef } from 'react';
import Login from './Login'; 
import './App.css';

function App() {
  
  // --- 1. AQUÍ ESTÁ EL CANDADO (Debe estar en FALSE) ---
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  // --- 2. CONFIGURACIÓN DE LA TARJETA ---
  const bannerInputRef = useRef(null);
  const fotoInputRef = useRef(null);

  const [config, setConfig] = useState({
    nombre: "Juan Pérez",
    cargo: "CEO & Founder",
    empresa: "Awna Global",
    descripcion: "Impulsando la transformación digital en LATAM. Conectemos para crear oportunidades.",
    telefono: "+56912345678",
    email: "contacto@awna.cl",
    web: "www.awna.cl",
    direccion: "Av. Apoquindo 4500, Santiago",
    twitter: "juanperez_dev", 
    linkedin: "juanperez",
    fotoPerfil: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    bannerFondo: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    colorTema: "#2563EB"
  });

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setConfig({ ...config, [field]: localUrl });
    }
  };

  // --- FUNCIÓN 1: GENERAR vCARD (CONTACTO) ---
  const generarVCard = () => {
    const partes = config.nombre.split(" ");
    const apellido = partes.length > 1 ? partes.pop() : "";
    const nombrePila = partes.join(" ");

    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${config.nombre}
N:${apellido};${nombrePila};;;
ORG:${config.empresa}
TITLE:${config.cargo}
TEL;TYPE=CELL:${config.telefono}
EMAIL;TYPE=WORK,INTERNET:${config.email}
URL:${config.web}
ADR;TYPE=WORK:;;${config.direccion};;;;
NOTE:LinkedIn: ${config.linkedin} | Twitter: ${config.twitter} | Bio: ${config.descripcion}
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${config.nombre.replace(/\s+/g, "_")}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- FUNCIÓN 2: COMPARTIR TARJETA (NUEVA) ---
  const compartirTarjeta = async () => {
    const shareData = {
      title: `Tarjeta Digital de ${config.nombre}`,
      text: `Hola, te comparto mi contacto profesional de ${config.empresa}.`,
      url: window.location.href 
    };

    try {
      // Intenta abrir el menú nativo del celular
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Si no soporta "share" (PC), copia al portapapeles
        await navigator.clipboard.writeText(shareData.url);
        alert("¡Enlace copiado! Pégalo en WhatsApp, Email o LinkedIn.");
      }
    } catch (err) {
      console.error("Error al compartir:", err);
    }
  };

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.direccion)}`;
  const qrDinamicUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://${config.web}`;

  // Iconos SVG
  const Icons = {
    phone: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
    mail: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    map: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    web: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
    linkedin: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
    twitter: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>,
    arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  };

  // --- 3. EL PORTERO: SI NO ESTÁ LOGUEADO, MUESTRA LOGIN ---
  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  // --- 4. SI PASA EL LOGIN, MUESTRA LA APP ---
  return (
    <div className="contenedor-principal">
      
      {/* PANEL EDITOR */}
      <div className="panel-demo">
        <div className="panel-header-row">
            <h3>Awna Editor</h3>
            <button onClick={() => setIsLoggedIn(false)} className="btn-logout">Salir</button>
        </div>

        <p>Personaliza tu tarjeta "Global"</p>
        <div className="inputs-grid">
            <div className="input-group"><label>Nombre</label><input type="text" name="nombre" value={config.nombre} onChange={handleChange} /></div>
            <div className="input-group"><label>Cargo</label><input type="text" name="cargo" value={config.cargo} onChange={handleChange} /></div>
            <div className="input-group"><label>Empresa</label><input type="text" name="empresa" value={config.empresa} onChange={handleChange} /></div>
            <div className="input-group full-width"><label>Bio</label><textarea rows="2" name="descripcion" value={config.descripcion} onChange={handleChange}/></div>
            
            <div className="titulo-seccion">CONTACTO</div>
            <div className="input-group"><label>Teléfono</label><input type="text" name="telefono" value={config.telefono} onChange={handleChange} /></div>
            <div className="input-group"><label>Email</label><input type="text" name="email" value={config.email} onChange={handleChange} /></div>
            <div className="input-group full-width"><label>Dirección</label><input type="text" name="direccion" value={config.direccion} onChange={handleChange} /></div>

            <div className="titulo-seccion">REDES</div>
            <div className="input-group"><label>Twitter User</label><input type="text" name="twitter" value={config.twitter} onChange={handleChange} /></div>
            <div className="input-group"><label>LinkedIn User</label><input type="text" name="linkedin" value={config.linkedin} onChange={handleChange} /></div>

            <div className="input-group"><label>Color Marca</label><input type="color" name="colorTema" value={config.colorTema} onChange={handleChange} className="input-color" /></div>
        </div>
      </div>

      {/* TARJETA */}
      <div className="tarjeta-virtual">
        
        {/* Banner */}
        <input type="file" ref={bannerInputRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'bannerFondo')}/>
        <div className="banner-superior editable-area" style={{ backgroundImage: `url(${config.bannerFondo})` }} onClick={() => bannerInputRef.current.click()}>
            <div className="overlay-editar"><span>📷 Cambiar</span></div>
            <div className="onda-banner">
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>
        </div>

        {/* Cabecera */}
        <div className="cabecera-tarjeta">
            <div className="info-texto">
                <h1>{config.nombre}</h1>
                <p className="cargo" style={{ color: config.colorTema }}>{config.cargo}</p>
                <p className="empresa-txt">{config.empresa}</p>
                <p className="descripcion-breve">{config.descripcion}</p>
            </div>
            
            <input type="file" ref={fotoInputRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'fotoPerfil')}/>
            <div className="contenedor-foto editable-area-round" onClick={() => fotoInputRef.current.click()}>
                <img src={config.fotoPerfil} alt="Perfil" className="foto-perfil" />
                <div className="overlay-editar-round"><span>📷</span></div>
            </div>
        </div>

        {/* Lista Contactos */}
        <div className="lista-contacto">
          
          <a href={`tel:${config.telefono}`} className="item-contacto">
            <div className="icono-circulo" style={{backgroundColor: config.colorTema}}>
                {Icons.phone}
            </div>
            <div className="datos-contacto">
                <span className="titulo-dato">Móvil</span>
                <span className="valor-dato">{config.telefono}</span>
            </div>
            <div className="flecha-simple">{Icons.arrow}</div>
          </a>

          <a href={`mailto:${config.email}`} className="item-contacto">
            <div className="icono-circulo" style={{backgroundColor: config.colorTema}}>
                {Icons.mail}
            </div>
             <div className="datos-contacto">
                <span className="titulo-dato">Correo</span>
                <span className="valor-dato">{config.email}</span>
            </div>
            <div className="flecha-simple">{Icons.arrow}</div>
          </a>

          <a href={mapLink} target="_blank" rel="noreferrer" className="item-contacto">
            <div className="icono-circulo" style={{backgroundColor: config.colorTema}}>
                {Icons.map}
            </div>
             <div className="datos-contacto">
                <span className="titulo-dato">Oficina</span>
                <span className="valor-dato">{config.direccion}</span>
            </div>
            <div className="flecha-simple">{Icons.arrow}</div>
          </a>

          <div className="redes-row">
            <a href={`https://linkedin.com/in/${config.linkedin}`} target="_blank" rel="noreferrer" className="btn-red social-linkedin">
                {Icons.linkedin} <span>LinkedIn</span>
            </a>
             <a href={`https://twitter.com/${config.twitter}`} target="_blank" rel="noreferrer" className="btn-red social-twitter">
                {Icons.twitter} <span>Twitter/X</span>
            </a>
          </div>

          <a href={`https://${config.web}`} className="item-contacto">
            <div className="icono-circulo" style={{backgroundColor: config.colorTema}}>
                {Icons.web}
            </div>
             <div className="datos-contacto">
                <span className="titulo-dato">Sitio Web</span>
                <span className="valor-dato">{config.web}</span>
            </div>
            <div className="flecha-simple">{Icons.arrow}</div>
          </a>
        </div>

        <div className="acciones-row">
          {/* Botón Guardar */}
          <button 
            className="btn-guardar" 
            style={{ background: config.colorTema }} 
            onClick={generarVCard}
          >
            Guardar Contacto
          </button>
          
          {/* Botón Compartir (CONECTADO) */}
          <button className="btn-compartir-circular" onClick={compartirTarjeta}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          </button>
        </div>

        <div className="footer-qr">
          <img src={qrDinamicUrl} alt="QR" className="imagen-qr" />
        </div>

      </div>
    </div>
  );
}

export default App;