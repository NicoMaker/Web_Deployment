import React, { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  const [clientInfo, setClientInfo] = useState({});

  useEffect(() => {
    // L'oggetto navigator contiene informazioni sul browser e l'OS client
    const { 
      userAgent, 
      platform, 
      language, 
      vendor, 
      cookieEnabled,
      hardwareConcurrency // Ad esempio, il numero di core logici della CPU
    } = window.navigator;
    
    // Funzione helper per determinare un OS più leggibile
    const getOS = () => {
      if (userAgent.includes('Win')) return 'Windows';
      if (userAgent.includes('Mac')) return 'macOS';
      if (userAgent.includes('Linux')) return 'Linux';
      if (userAgent.includes('Android')) return 'Android';
      if (userAgent.includes('iPhone')) return 'iOS';
      return 'Sconosciuto';
    };

    setClientInfo({
      osGuess: getOS(),
      userAgent: userAgent,
      platform: platform,
      browserLanguage: language,
      browserVendor: vendor,
      isCookieEnabled: cookieEnabled ? 'Sì' : 'No',
      cpuCores: hardwareConcurrency || 'N/A' // Numero di core logici della CPU
    });
  }, []);

  if (Object.keys(clientInfo).length === 0) {
    return (
      <div className="App">
        <h1>Caricamento informazioni client...</h1>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>🕵️ Informazioni del Sistema/Browser Client</h1>
        <p>Questi dati sono forniti dal browser, **non** dal sistema operativo completo.</p>
      </header>
      
      <div className="info-container">
        
        <section className="card general-info">
          <h2>Dati del Client</h2>
          <ul>
            <li>**Sistema Operativo (Stimato):** {clientInfo.osGuess}</li>
            <li>**Piattaforma:** {clientInfo.platform}</li>
            <li>**Core CPU (Logici):** {clientInfo.cpuCores}</li>
            <li>**Lingua Browser:** {clientInfo.browserLanguage}</li>
            <li>**Cookie Abilitati:** {clientInfo.isCookieEnabled}</li>
          </ul>
        </section>

        <section className="card tech-details">
          <h2>Dettagli Browser Completi</h2>
          <ul>
            <li>**User Agent:** <span className="small-text">{clientInfo.userAgent}</span></li>
            <li>**Vendor:** {clientInfo.browserVendor || 'Sconosciuto'}</li>
          </ul>
        </section>

      </div>
      
    </div>
  );
}

export default App;