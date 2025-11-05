import React, { useState, useEffect, useCallback } from 'react';
import './App.css'; 

function App() {
  const [osData, setOsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // La URL del tuo backend Node.js
  const API_URL = 'http://localhost:5000/api/os-info';

  const loadOSData = useCallback(async () => {
    try {
      // Usiamo fetch per chiamare l'API HTTP del tuo server Node.js
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Errore HTTP! Stato: ${response.status}`);
      }
      
      const data = await response.json();
      setOsData(data);

    } catch (err) {
      // Questo è l'errore più comune se il backend è spento
      setError(`❌ Connessione fallita. Assicurati che il tuo server Node.js sia attivo sulla porta 5000. Dettagli: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Esegui il fetch dei dati iniziali e poi aggiorna ogni 3 secondi
    loadOSData();
    const intervalId = setInterval(loadOSData, 3000); 

    // Pulizia
    return () => clearInterval(intervalId);
  }, [loadOSData]); 

  // --- RENDERING DELL'INTERFACCIA (Stili e logica sono gli stessi) ---
  
  if (loading) {
    return <div className="App"><div className="spinner"></div><h1>Analisi Hardware...</h1></div>;
  }
  
  if (error) {
    return <div className="App error-panel"><h1>{error}</h1></div>;
  }

  // Calcoli per la UX (usiamo i dati del backend)
  const memUsagePercent = ((osData.usedMemoryGB / osData.totalMemoryGB) * 100).toFixed(1);
  const cpuSpeed = osData.cpuModel.match(/@ (\d+(\.\d+)?)GHz/) ? osData.cpuModel.match(/@ (\d+(\.\d+)?)GHz/)[1] : 'N/A';
  const osName = osData.platform === 'win32' ? 'Windows' : osData.platform === 'darwin' ? 'macOS' : osData.type;

  return (
    <div className="App system-dashboard">
      
      {/* Header e Banner principale */}
      <header className="header-professional">
        <h1>📊 Monitoraggio Sistema (Server API)</h1>
        <p>Piattaforma: **{osName}** | Hostname: **{osData.hostname}** | Uptime: **{osData.uptimeDays} giorni**</p>
      </header>
      
      <div className="dashboard-grid">
          
        {/* CARD 1: Utilizzo Memoria */}
        <div className="stat-card stat-mem">
          <div className="card-top-info">
            <span className="info-icon">🧠</span>
            <h3>Memoria RAM</h3>
          </div>
          <div className="metric-display">
            <span className="metric-value">{memUsagePercent}%</span>
            <span className="metric-label">Utilizzato</span>
          </div>
          <div className="progress-container">
            <div 
              className="progress-fill" 
              style={{ width: `${memUsagePercent}%` }}
              title={`Utilizzo: ${memUsagePercent}%`}
            ></div>
          </div>
          <p className="detail-line">Liberi: {osData.freeMemoryGB} GB / Totale: {osData.totalMemoryGB} GB</p>
        </div>

        {/* CARD 2: CPU */}
        <div className="stat-card stat-cpu">
          <div className="card-top-info">
            <span className="info-icon">⚡</span>
            <h3>Unità Centrale (CPU)</h3>
          </div>
          <p className="cpu-model-line">{osData.cpuModel}</p>
          <div className="metric-group">
             <div className="metric-box">
                 <span className="metric-key">Core Logici:</span>
                 <span className="metric-value-small">{osData.cpuCores}</span>
             </div>
             <div className="metric-box">
                 <span className="metric-key">Architettura:</span>
                 <span className="metric-value-small">{osData.arch}</span>
             </div>
             <div className="metric-box">
                 <span className="metric-key">Velocità Stima:</span>
                 <span className="metric-value-small">{cpuSpeed} GHz</span>
             </div>
          </div>
        </div>

        {/* CARD 3: Dettagli OS e Utente */}
        <div className="stat-card stat-os">
          <div className="card-top-info">
            <span className="info-icon">💻</span>
            <h3>Sistema Operativo</h3>
          </div>
          <div className="detail-list">
             <p>Tipo di OS:</p> **{osData.type}**
             <p>Versione Kernel:</p> **{osData.release}**
             <p>Nome Utente:</p> **{osData.userInfo.username}**
             <p>Architettura:</p> **{osData.arch}**
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;