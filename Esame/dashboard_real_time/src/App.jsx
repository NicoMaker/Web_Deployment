// src/App.js
import React, { useEffect, useState } from 'react';
import io from "socket.io-client";

function App() {
  const [stats, setStats] = useState([]);
  const [osInfo, setOsInfo] = useState({});
  const [last, setLast] = useState({ram: null, disk: null, cpu: null});

  useEffect(() => {
    const socket = io("http://localhost:3001", {transports: ["websocket"]});
    socket.on("osinfo", (info) => setOsInfo(info));
    socket.on("system-stats", (data) => {
      setLast(data);
      setStats(prev => ([...prev.slice(-59), data])); // Solo ultimi 60 punti cioè 1 min
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h2>Monitoraggio Sistema ({osInfo.platform})</h2>
      <ul>
        <li>Memoria RAM disponibile: {last.ram} MB</li>
        <li>Spazio Disco disponibile: {last.disk} MB</li>
        <li>CPU Usage: {last.cpu}%</li>
      </ul>
      {/* Inserisci i grafici react (es. con recharts, victory, chart.js) per visualizzare stats */}
    </div>
  );
}
export default App;
