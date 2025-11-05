import React, { useState, useEffect, useCallback } from 'react';
import './App.css'; 

function App() {
  const [osData, setOsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/os-info';

  const loadOSData = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Errore HTTP! Stato: ${response.status}`);
      }
      const data = await response.json();
      setOsData(data);
    } catch (err) {
      setError(`❌ Connessione fallita. Assicurati che il server Node.js sia attivo sulla porta 5000. Dettagli: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOSData();
    const intervalId = setInterval(loadOSData, 3000); 
    return () => clearInterval(intervalId);
  }, [loadOSData]);

  if (loading) {
    return <div className="App"><div className="spinner"></div><h1>Analisi e Connessione ai Dati...</h1></div>;
  }
  
  if (error) {
    return <div className="App error-panel"><h1>{error}</h1></div>;
  }

  // --- CALCOLI PER LA DASHBOARD ---
  const memUsagePercent = ((osData.usedMemoryGB / osData.totalMemoryGB) * 100).toFixed(1);
  const diskUsagePercent = ((osData.usedDiskGB / osData.totalDiskGB) * 100).toFixed(1); // NOVITÀ!
  
  const cpuSpeed = osData.cpuModel.match(/@ (\d+(\.\d+)?)GHz/) ? osData.cpuModel.match(/@ (\d+(\.\d+)?)GHz/)[1] : 'N/A';
  const osName = osData.platform === 'win32' ? 'Windows' : osData.platform === 'darwin' ? 'macOS' : osData.type;

  // --- STRUTTURA FINALE DELLA DASHBOARD (RAM in Primo Piano) ---
  return (
    <div className="App full-screen-dashboard">
        
        {/* Header principale */}
        <header className="header-professional large-header">
            <h1>Monitoraggio RAM & ROM 💾🧠</h1>
            <p>Piattaforma: **{osName}** | Hostname: **{osData.hostname}** | Uptime: **{osData.uptimeDays} giorni**</p>
        </header>
        
        <div className="main-content-grid">
            
            {/* BOX 1: RAM - TUTTA LA LARGHEZZA */}
            <div className="full-width-card ram-focus-card">
                <div className="card-title-bar">
                    <span className="title-icon ram-icon">🧠</span>
                    <h2>Utilizzo Memoria RAM (Temporanea)</h2>
                    <span className="total-tag">Totale RAM: {osData.totalMemoryGB} GB</span>
                </div>
                
                <div className="ram-content-focus">
                    
                    {/* Percentuale Utilizzata */}
                    <div className="ram-metric-large usage-metric">
                        <span className="large-gauge-value">{memUsagePercent}%</span>
                        <span className="large-gauge-label">Utilizzato</span>
                    </div>
                    
                    {/* Memoria Libera (Assoluto) */}
                    <div className="ram-metric-large free-metric">
                        <span className="large-gauge-value free-color">{osData.freeMemoryGB} GB</span>
                        <span className="large-gauge-label">Libera</span>
                    </div>

                    {/* Memoria Utilizzata (Assoluto) */}
                    <div className="ram-metric-large used-metric">
                        <span className="large-gauge-value used-color">{osData.usedMemoryGB} GB</span>
                        <span className="large-gauge-label">Utilizzata</span>
                    </div>
                </div>

                {/* Barra di progresso a fondo card */}
                <div className="progress-bar-container large-bottom">
                    <div 
                        className="progress-bar-fill" 
                        style={{ width: `${memUsagePercent}%` }}
                    ></div>
                </div>
            </div>
            
            {/* BOX 2: ROM/DISCO - SECONDA RIGA, TUTTA LA LARGHEZZA */}
            <div className="full-width-card rom-focus-card">
                <div className="card-title-bar">
                    <span className="title-icon rom-icon">💾</span>
                    <h2>Utilizzo Spazio Disco ({osData.diskPath})</h2>
                    <span className="total-tag">Totale ROM: {osData.totalDiskGB} GB</span>
                </div>
                
                <div className="ram-content-focus"> 
                    
                    {/* Percentuale Utilizzata */}
                    <div className="ram-metric-large usage-metric">
                        <span className="large-gauge-value">{diskUsagePercent}%</span>
                        <span className="large-gauge-label">Utilizzato</span>
                    </div>
                    
                    {/* Spazio Libero (Assoluto) */}
                    <div className="ram-metric-large free-metric">
                        <span className="large-gauge-value disk-free-color">{osData.freeDiskGB} GB</span>
                        <span className="large-gauge-label">Libero</span>
                    </div>

                    {/* Spazio Utilizzato (Assoluto) */}
                    <div className="ram-metric-large used-metric">
                        <span className="large-gauge-value disk-used-color">{osData.usedDiskGB} GB</span>
                        <span className="large-gauge-label">Utilizzato</span>
                    </div>
                </div>

                {/* Barra di progresso a fondo card */}
                <div className="progress-bar-container large-bottom">
                    <div 
                        className="progress-bar-fill disk-fill" 
                        style={{ width: `${diskUsagePercent}%` }}
                    ></div>
                </div>
            </div>

            {/* BOX 3: CPU Specs - ULTIMA RIGA, METÀ SPAZIO */}
            <div className="half-card info-box-cpu">
                <h2>Specifiche CPU</h2>
                <div className="cpu-specs">
                    <p className="cpu-model-line">Modello: {osData.cpuModel}</p>
                    <div className="specs-row">
                        <div className="spec-box">
                            <span className="spec-label">Core Logici</span>
                            <strong className="spec-value">{osData.cpuCores}</strong>
                        </div>
                        <div className="spec-box">
                            <span className="spec-label">Architettura</span>
                            <strong className="spec-value">{osData.arch}</strong>
                        </div>
                        <div className="spec-box">
                            <span className="spec-label">Velocità Stima</span>
                            <strong className="spec-value">{cpuSpeed} GHz</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOX 4: Uptime & OS Info - ULTIMA RIGA, METÀ SPAZIO */}
            <div className="half-card info-box-os">
                <h2>Informazioni di Sistema</h2>
                <div className="info-group">
                    <div className="info-item">
                        <span className="info-label">OS Kernel:</span>
                        <strong className="info-data">{osData.type} {osData.release}</strong>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Utente Attivo:</span>
                        <strong className="info-data">{osData.userInfo.username}</strong>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  );
}

export default App;