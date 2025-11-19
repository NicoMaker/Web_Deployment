## 🚀 Istruzioni di Avvio del Programma

Per avviare l'applicazione, è necessario aprire **due finestre separate del prompt dei comandi** (o terminale) e lanciare i comandi specifici per il **Backend** e il **Frontend**.

---

## 💻 1. Avvio del Backend

Il Backend si trova nella cartella: `Backend_dashboard_real_time`.

### ➡️ Passaggi per l'Avvio del Backend

1.  **Naviga** alla cartella del Backend.

    ```bash
    cd Backend_dashboard_real_time
    ```

2.  **Installa** le dipendenze necessarie (da eseguire solo la prima volta o dopo modifiche al file `package.json`).
    _Questo comando scarica tutti i pacchetti necessari per il funzionamento del server._

    ```bash
    npm i
    ```

3.  **Avvia** il server del Backend.
    _Questo comando esegue lo script di avvio definito nel file `package.json` (solitamente `node index.js` o simile) e mette il server in ascolto._

    ```bash
    npm run start
    ```

    ✅ Il Backend è ora in esecuzione e pronto a gestire le richieste. **Lascia questa finestra del terminale aperta.**

---

## 🖥️ 2. Avvio del Frontend

Il Frontend (l'interfaccia utente/dashboard) si trova nella cartella: `frontend_dashboard_real_time`.

### ➡️ Passaggi per l'Avvio del Frontend

1.  **Apri una nuova finestra** del prompt dei comandi/terminale.

2.  **Naviga** alla cartella del Frontend.

    ```bash
    cd frontend_dashboard_real_time
    ```

3.  **Installa** le dipendenze necessarie (da eseguire solo la prima volta o dopo modifiche al file `package.json`).
    _Questo comando scarica tutti i pacchetti necessari per la costruzione e l'esecuzione dell'interfaccia utente._

    ```bash
    npm i
    ```

4.  **Avvia** il server di sviluppo del Frontend.
    _Questo comando avvia l'ambiente di sviluppo locale, che di solito include il **Live Reloading** per aggiornare automaticamente il browser quando si salvano le modifiche al codice._

    ```bash
    npm run dev
    ```

    ✅ Il Frontend è ora in esecuzione. Il terminale indicherà l'indirizzo (URL) su cui è disponibile l'applicazione (solitamente `http://localhost:3000` o simile).

---

## 🛠️ Riepilogo e Utilizzo

Una volta che entrambi i processi sono in esecuzione, puoi accedere all'applicazione aprendo l'indirizzo fornito dal **Frontend** nel tuo browser web.

- **Backend:** Gestisce la logica, i dati e le connessioni in tempo reale.
- **Frontend:** Visualizza l'interfaccia utente e interagisce con il Backend.

**Nota:** Per spegnere l'applicazione, è sufficiente premere **Ctrl + C** in ciascuna delle due finestre del terminale.
