const express = require('express');
const os = require('os');
const cors = require('cors'); // Per permettere a React di accedere
const app = express();
const PORT = 5000; // Porta standard per le API di backend

// 1. Configurazione Middleware
// Permette al frontend (React) di accedere ai dati
// Sostituisci l'URL con l'indirizzo esatto del tuo frontend se non usi la porta 3000
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'] 
}));
app.use(express.json());

// 2. Funzione per Raccogliere i Dati OS Completi
const getOSInfo = () => {
    // Calcoli di conversione (da byte a GB)
    const totalMemoryGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMemoryGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const usedMemoryGB = (totalMemoryGB - freeMemoryGB).toFixed(2);

    // Calcolo dell'Uptime (da secondi a giorni)
    const uptimeSeconds = os.uptime();
    const uptimeDays = (uptimeSeconds / 60 / 60 / 24).toFixed(1);

    // Mappa le informazioni della CPU (usiamo solo i dati del primo core per il modello)
    const cpus = os.cpus();

    return {
        // Generali
        platform: os.platform(),
        type: os.type(),
        arch: os.arch(),
        release: os.release(),
        hostname: os.hostname(),
        uptimeDays: uptimeDays,
        uptimeSeconds: uptimeSeconds, // utile per un monitoraggio più preciso
        
        // Memoria (RAM)
        totalMemoryGB: totalMemoryGB,
        freeMemoryGB: freeMemoryGB,
        usedMemoryGB: usedMemoryGB,

        // CPU
        cpuModel: cpus[0].model,
        cpuCores: cpus.length,
        
        // Utente
        userInfo: os.userInfo(),
        
        // Interfacce di Rete (potrebbe essere un output molto lungo)
        // networkInterfaces: os.networkInterfaces() 
    };
};

// 3. Endpoint API
app.get('/api/os-info', (req, res) => {
    // Restituisce tutti i dati OS in formato JSON
    res.json(getOSInfo());
});

// 4. Avvio del Server
app.listen(PORT, () => {
  console.log(`✅ Backend API Node.js avviato su http://localhost:${PORT}`);
  console.log('API Endpoint: http://localhost:5000/api/os-info');
});