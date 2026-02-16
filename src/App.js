import React, { useState, useRef } from 'react';
import Login from './Login'; 
import './App.css';

function App() {
  
  // --- 1. ESTADO DE AUTENTICACIÓN ---
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [mostrarQR, setMostrarQR] = useState(false);

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
    whatsapp: "56912345678",
    instagram: "tu_usuario",
    tiktok: "tu_usuario",
    facebook: "tu_pagina",
    fotoPerfil: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    bannerFondo: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    colorTema: "#2563EB"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Si el usuario está editando el color, forzamos formato Hexadecimal limpio
    if (name === "colorTema") {
      // Si no empieza con #, se lo agregamos
      if (!value.startsWith("#")) {
        finalValue = "#" + value;
      }
      // Limitamos a 7 caracteres (# + 6 hex) para evitar errores
      finalValue = finalValue.substring(0, 7);
    }

    setConfig({ ...config, [name]: finalValue });
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setConfig({ ...config, [field]: localUrl });
    }
  };

  // --- GENERAR vCARD ---
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

  // --- COMPARTIR TARJETA ---
  const compartirTarjeta = async () => {
    const shareData = {
      title: `Tarjeta Digital de ${config.nombre}`,
      text: `Hola, te comparto mi contacto profesional de ${config.empresa}.`,
      url: window.location.href 
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("¡Enlace copiado! Pégalo en WhatsApp, Email o LinkedIn.");
      }
    } catch (err) {
      console.error("Error al compartir:", err);
    }
  };

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.direccion)}`;
  const qrDinamicUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`;

  // Iconos SVG
  const Icons = {
    phone: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
    mail: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    map: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    web: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
    whatsapp: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    instagram: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.977 6.981 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.981-6.977.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.977-6.981C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324A4.162 4.162 0 0112 16zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
    tiktok: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.31-2.34-.25-3.41.33-.71.38-1.27 1.03-1.57 1.77-.34.85-.33 1.82.04 2.62.32.75.93 1.35 1.65 1.72.79.42 1.72.55 2.59.39 1.2-.2 2.22-1.05 2.68-2.15.22-.52.29-1.1.3-1.67-.02-5.16-.01-10.32-.02-15.48z"/></svg>,
    facebook: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    twitter: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>,
    arrow: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  };

  // --- 3. LOGIN GATE ---
  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  // --- 4. APP MAIN ---
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
            <div className="input-group"><label>Web</label><input type="text" name="web" value={config.web} onChange={handleChange} /></div>
            <div className="input-group full-width"><label>Dirección</label><input type="text" name="direccion" value={config.direccion} onChange={handleChange} /></div>

            <div className="titulo-seccion">REDES</div>
            <div className="input-group"><label>WhatsApp (ej: 569...)</label><input type="text" name="whatsapp" value={config.whatsapp} onChange={handleChange} /></div>
            <div className="input-group"><label>Instagram User</label><input type="text" name="instagram" value={config.instagram} onChange={handleChange} /></div>
            <div className="input-group"><label>TikTok User</label><input type="text" name="tiktok" value={config.tiktok} onChange={handleChange} /></div>
            <div className="input-group"><label>Facebook User</label><input type="text" name="facebook" value={config.facebook} onChange={handleChange} /></div>
            <div className="input-group"><label>Twitter/X User</label><input type="text" name="twitter" value={config.twitter} onChange={handleChange} /></div>
            
            <div className="input-group full-width">
  <label>Color de Marca (Hexadecimal)</label>
  <div style={{ display: 'flex', gap: '8px' }}>
    {/* Input de texto para escribir el código manualmente */}
    <input 
      type="text" 
      name="colorTema" 
      value={config.configTema} 
      onChange={handleChange} 
      placeholder="#000000"
      style={{ flex: 1, textTransform: 'uppercase', fontFamily: 'monospace' }}
    />
    {/* Selector visual que se sincroniza con el texto */}
    <input 
      type="color" 
      name="colorTema" 
      value={config.colorTema} 
      onChange={handleChange} 
      className="input-color" 
      style={{ width: '45px', padding: '0', cursor: 'pointer', height: '38px' }}
    />
  </div>
  
</div>
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
                {config.cargo && <p className="cargo" style={{ color: config.colorTema }}>{config.cargo}</p>}
                {config.empresa && <p className="empresa-txt">{config.empresa}</p>}
                {config.descripcion && <p className="descripcion-breve">{config.descripcion}</p>}
            </div>

            <input type="file" ref={fotoInputRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'fotoPerfil')}/>
            <div className="contenedor-foto editable-area-round" onClick={() => fotoInputRef.current.click()}>
                <img src={config.fotoPerfil} alt="Perfil" className="foto-perfil" />
                <div className="overlay-editar-round"><span>📷</span></div>
            </div>
        </div>

        {/* Redes Horizontales (Solo si existen) */}
        {(config.whatsapp || config.instagram || config.tiktok || config.facebook || config.twitter) && (
          <div className="redes-horizontales">
              {config.whatsapp && <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noreferrer" className="btn-social-circle social-whatsapp">{Icons.whatsapp}</a>}
              {config.instagram && <a href={`https://instagram.com/${config.instagram}`} target="_blank" rel="noreferrer" className="btn-social-circle social-instagram">{Icons.instagram}</a>}
              {config.tiktok && <a href={`https://tiktok.com/@${config.tiktok}`} target="_blank" rel="noreferrer" className="btn-social-circle social-tiktok">{Icons.tiktok}</a>}
              {config.facebook && <a href={`https://facebook.com/${config.facebook}`} target="_blank" rel="noreferrer" className="btn-social-circle social-facebook">{Icons.facebook}</a>}
              {config.twitter && <a href={`https://twitter.com/${config.twitter}`} target="_blank" rel="noreferrer" className="btn-social-circle social-twitter">{Icons.twitter}</a>}
          </div>
        )}

        {/* Lista Contactos (Solo si existen) */}
        <div className="lista-contacto">
          {config.telefono && (
            <a href={`tel:${config.telefono}`} className="item-contacto">
              <div className="icono-circulo" style={{backgroundColor: config.colorTema}}>{Icons.phone}</div>
              <div className="datos-contacto">
                  <span className="titulo-dato">Móvil</span>
                  <span className="valor-dato">{config.telefono}</span>
              </div>
              <div className="flecha-simple">{Icons.arrow}</div>
            </a>
          )}

          {config.email && (
            <a href={`mailto:${config.email}`} className="item-contacto">
              <div className="icono-circulo" style={{backgroundColor: config.colorTema}}>{Icons.mail}</div>
              <div className="datos-contacto">
                  <span className="titulo-dato">Correo</span>
                  <span className="valor-dato">{config.email}</span>
              </div>
              <div className="flecha-simple">{Icons.arrow}</div>
            </a>
          )}

          {config.direccion && (
            <a href={mapLink} target="_blank" rel="noreferrer" className="item-contacto">
              <div className="icono-circulo" style={{backgroundColor: config.colorTema}}>{Icons.map}</div>
              <div className="datos-contacto">
                  <span className="titulo-dato">Oficina</span>
                  <span className="valor-dato">{config.direccion}</span>
              </div>
              <div className="flecha-simple">{Icons.arrow}</div>
            </a>
          )}

          {config.web && (
            <a href={`https://${config.web}`} target="_blank" rel="noreferrer" className="item-contacto">
              <div className="icono-circulo" style={{backgroundColor: config.colorTema}}>{Icons.web}</div>
              <div className="datos-contacto">
                  <span className="titulo-dato">Sitio Web</span>
                  <span className="valor-dato">{config.web}</span>
              </div>
              <div className="flecha-simple">{Icons.arrow}</div>
            </a>
          )}
        </div>

        <div className="acciones-row">
          <button className="btn-guardar" style={{ background: config.colorTema }} onClick={generarVCard}>
            Guardar Contacto
          </button>
          <button className="btn-compartir-circular" onClick={compartirTarjeta}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          </button>
        </div>

       {/* --- SECCIÓN QR RE-DISEÑADA --- */}
        <div style={{ padding: '0 20px 25px 20px' }}>
          
          {/* BOTÓN LIMPIO PARA ABRIR QR */}
          <button className="btn-ver-qr" onClick={() => setMostrarQR(true)}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><path d="M3 14h7v7H3z"></path></svg>
             Ver Código QR
          </button>

        </div>

        {/* --- MODAL FLOTANTE (ESTO VA DENTRO DE TARJETA-VIRTUAL PERO FLOTA) --- */}
        {mostrarQR && (
          <div className="qr-overlay" onClick={() => setMostrarQR(false)}>
            {/* stopPropagation evita que al hacer click en el QR se cierre */}
            <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="qr-titulo-modal">Escanea para conectar</h3>
                
                <img src={qrDinamicUrl} alt="QR Code" className="imagen-qr-modal" />
                
                <button className="btn-cerrar-modal" onClick={() => setMostrarQR(false)}>
                  Cerrar
                </button>
            </div>
          </div>
        )}

      </div>
    </div>      
  );  
}
export default App;