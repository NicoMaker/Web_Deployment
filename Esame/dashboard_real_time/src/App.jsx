import * as React from "react";
import { useEffect, useState } from "react";
import {
  CssBaseline, Container, Paper, Typography, Grid, Box, Divider,
  Table, TableContainer, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";
import MemoryIcon from "@mui/icons-material/Memory";
import StorageIcon from "@mui/icons-material/Storage";
import SpeedIcon from "@mui/icons-material/Speed";
import io from "socket.io-client";

const MAX_POINTS = 60;

function App() {
  const [stats, setStats] = useState([]);
  const [osInfo, setOsInfo] = useState({});
  const [latest, setLatest] = useState({ ram: 0, cpu: 0, disk: 0 });

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socket.on("osinfo", setOsInfo);
    socket.on("system-stats", (data) => {
      setLatest(data);
      setStats(old => [...old.slice(-MAX_POINTS + 1), {
        time: new Date().toLocaleTimeString(),
        ...data
      }]);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" sx={{
        mt: 6, mb: 4,
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Header e Box Valori */}
        <Paper elevation={8} sx={{
          p: 3,
          mb: 4,
          borderRadius: 5,
          boxShadow: 6,
          background: "linear-gradient(135deg, #a7f3d0 60%, #f3f4f6 100%)",
        }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: "#134e4a" }}>
            Dashboard Risorse <span style={{ fontSize: 20, color: "#94a3b8" }}>(OS: {osInfo.platform})</span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "#6b7280", mb: 2 }}>{osInfo.hostname}</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", borderRadius: 2, bgcolor: "#e0e7ff", p: 2 }}>
                <MemoryIcon fontSize="large" color="primary" />
                <Box ml={2}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "#3b82f6" }}>RAM libera</Typography>
                  <Typography variant="h5">
                    {latest.ram} <span style={{ fontSize: 16, color: "#64748b" }}>GB</span>
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", borderRadius: 2, bgcolor: "#f0fdf4", p: 2 }}>
                <StorageIcon fontSize="large" sx={{ color: "#16a34a" }} />
                <Box ml={2}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "#16a34a" }}>Disco libero</Typography>
                  <Typography variant="h5">
                    {latest.disk} <span style={{ fontSize: 16, color: "#64748b" }}>GB</span>
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", borderRadius: 2, bgcolor: "#fff7ed", p: 2 }}>
                <SpeedIcon fontSize="large" sx={{ color: "#f59e42" }} />
                <Box ml={2}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "#f59e42" }}>CPU</Typography>
                  <Typography variant="h5">
                    {latest.cpu} <span style={{ fontSize: 16, color: "#64748b" }}>%</span>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabella storico */}
        <Paper elevation={2} sx={{ borderRadius: 3, p: 2 }}>
          <Typography variant="h6" sx={{ px: 1, pb: 1, fontWeight: 700 }}>
            Storico ultimi 60s (Live)
          </Typography>
          <TableContainer sx={{ maxHeight: 360, borderRadius: 2 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Orario</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>RAM (GB)</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Disco (GB)</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>CPU (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...stats].reverse().map((row, i) => (
                  <TableRow key={i} sx={i === 0 ? { backgroundColor: "#a7f3d0" } : {}}>
                    <TableCell>
                      <span style={{ fontFamily: "'Fira Mono', monospace" }}>{row.time}</span>
                    </TableCell>
                    <TableCell>{row.ram}</TableCell>
                    <TableCell>{row.disk}</TableCell>
                    <TableCell>{row.cpu}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </>
  );
}

export default App;
