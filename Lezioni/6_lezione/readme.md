[vai al file principlae](../../Readme.md)

# 6 Lezione 05 Novembre 2025

## Esercizio

- [Os Backend](os-backend-api)
- [Os client](os-info-client)

## comando per uccidere comando/servizio processo

```bash

sudo kill -9 id_processo # per uccidere il processo
sudo kill all processo # per uccidere tutti i processi con quel nome

```

## servizio con porte aperte

```bash
sudo netstat -tulpn # per vedere tutti i servizi con porte aperte (TCP e UDP)

# Alternativa moderna e più veloce a netstat
sudo ss -tulpn
```
