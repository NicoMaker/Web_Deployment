const express = require('express');
const os = require('os');
const cors = require('cors');
const checkDiskSpace = require('check-disk-space').default; // Nuovo modulo
const app = express();
const PORT = 5000; 

// Scegli il percorso del disco. 
// Su Windows è "C:". Su Linux/macOS usiamo os.userInfo().homedir (es. "/home/pi")
// per avere maggiore probabilità di accesso rispetto al root "/"
const DISK_PATH = os.platform() === 'win32' ? 'C:' : os.userInfo().homedir;

// Configurazione CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'] 
}));
app.use(express.json());

// La funzione deve diventare ASINCRONA per usare checkDiskSpace
const getOSInfo = async () => {
    // --- RAM (Dati OS Nativi) ---
    const totalMemoryGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMemoryGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const usedMemoryGB = (totalMemoryGB - freeMemoryGB).toFixed(2);

    const uptimeDays = (os.uptime() / 60 / 60 / 24).toFixed(1);
    const cpus = os.cpus();

    // --- ROM / DISK (Dati check-disk-space) ---
    // NOTA: Il percorso è ora più compatibile con Linux
    const diskInfo = await checkDiskSpace(DISK_PATH);
    
    // Calcoli di conversione (da byte a GB)
    const totalDiskGB = (diskInfo.size / 1024 / 1024 / 1024).toFixed(2);
    const freeDiskGB = (diskInfo.free / 1024 / 1024 / 1024).toFixed(2);
    const usedDiskGB = (totalDiskGB - freeDiskGB).toFixed(2);


    return {
        // Generali
        platform: os.platform(),
        type: os.type(),
        arch: os.arch(),
        release: os.release(),
        hostname: os.hostname(),
        uptimeDays: uptimeDays,
        
        // Memoria (RAM)
        totalMemoryGB: totalMemoryGB,
        freeMemoryGB: freeMemoryGB,
        usedMemoryGB: usedMemoryGB,

        // ROM (Disco) - NOVITÀ!
        diskPath: DISK_PATH,
        totalDiskGB: totalDiskGB,
        freeDiskGB: freeDiskGB,
        usedDiskGB: usedDiskGB,

        // CPU
        cpuModel: cpus[0].model,
        cpuCores: cpus.length,
        userInfo: os.userInfo(),
    };
};

// Endpoint API - ora deve essere ASINCRONO
app.get('/api/os-info', async (req, res) => {
    try {
        const data = await getOSInfo();
        res.json(data);
    } catch (error) {
        console.error("Errore nel recupero dati di sistema:", error);
        res.status(500).json({ error: "Impossibile recuperare i dati del sistema. Controllare i permessi del disco su " + DISK_PATH });
    }
});

app.listen(PORT, () => {
  console.log(`✅ Backend API Node.js avviato su http://localhost:${PORT}`);
  console.log(`⭐ Percorso Disco Monitorato: ${DISK_PATH}`);
});