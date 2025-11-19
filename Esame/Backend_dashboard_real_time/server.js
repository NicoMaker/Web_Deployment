const express = require('express');
const http = require('http');
const os = require('os');
const { exec } = require('child_process');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

function getOSInfo() {
  return {
    platform: os.platform(),
    release: os.release(),
    hostname: os.hostname(),
  };
}

function getStats(callback) {
  const platform = os.platform();

  if (platform === "win32") {
    exec('wmic OS get FreePhysicalMemory /Value', (err, stdout) => {
      const memMatch = stdout.match(/FreePhysicalMemory=(\d+)/);
      // RAM libera da KB → GB
      const ram = memMatch ? +(Number(memMatch[1]) / 1024 / 1024).toFixed(2) : null;

      exec('wmic LogicalDisk where DeviceID="C:" get FreeSpace /Value', (err2, stdout2) => {
        const diskMatch = stdout2.match(/FreeSpace=(\d+)/);
        // Disco libero da byte → GB
        const disk = diskMatch ? +(Number(diskMatch[1]) / (1024 * 1024 * 1024)).toFixed(2) : null;

        exec('wmic cpu get loadpercentage /value', (err3, stdout3) => {
          const cpuMatch = stdout3.match(/LoadPercentage=(\d+)/);
          const cpu = cpuMatch ? Number(cpuMatch[1]) : null;
          callback({ ram, disk, cpu, platform: 'windows' });
        });
      });
    });
  } else {
    exec(`free -m | awk '/Mem:/ {print $4}'`, (err, stdout) => {
      const ramMb = parseInt(stdout.trim(), 10);
      // RAM libera da MB → GB
      const ram = ramMb ? +(ramMb / 1024).toFixed(2) : null;

      exec(`df -m / | awk 'NR==2 {print $4}'`, (err2, stdout2) => {
        const diskMb = parseInt(stdout2.trim(), 10);
        // Disco libero da MB → GB
        const disk = diskMb ? +(diskMb / 1024).toFixed(2) : null;

        exec(`top -bn1 | grep "Cpu(s)" | awk '{print 100 - $8}'`, (err3, stdout3) => {
          let cpu = parseFloat(stdout3.trim());
          if (isNaN(cpu)) cpu = null;
          callback({ ram, disk, cpu, platform: 'linux' });
        });
      });
    });
  }
}

io.on("connection", (socket) => {
  socket.emit('osinfo', getOSInfo());
  const interval = setInterval(() => {
    getStats((data) => {
      socket.emit('system-stats', data);
    });
  }, 1000);

  socket.on("disconnect", () => clearInterval(interval));
});

server.listen(3001, () => {
  console.log("Backend listening on port 3001");
});
