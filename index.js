document.addEventListener("DOMContentLoaded", () => {
    let righe = 6;
    let colonne = 7;
    let giocatoreCorrente = "rosso";
    let tabellone = Array.from({ length: righe }, () => Array(colonne).fill(null));
    let tabelloneGioco = document.getElementById("tabellone-gioco");

    // Recupera le statistiche dal localStorage o inizializza se non esistono
    let statistiche = JSON.parse(localStorage.getItem("statisticheGioco")) || {
        vittorieRosso: 0,
        vittorieGiallo: 0,
        pareggi: 0
    };

    // Aggiorna le statistiche visualizzate sullo schermo
    function aggiornaStatisticheVisualizzate() {
        document.getElementById("vittorie-rosso").textContent = `Vittorie Rosso: ${statistiche.vittorieRosso}`;
        document.getElementById("vittorie-giallo").textContent = `Vittorie Giallo: ${statistiche.vittorieGiallo}`;
        document.getElementById("pareggi").textContent = `Pareggi: ${statistiche.pareggi}`;
    }

    // Salva le statistiche nel localStorage
    function salvaStatistiche() {
        localStorage.setItem("statisticheGioco", JSON.stringify(statistiche));
    }

    function creaTabellone() {
        tabelloneGioco.innerHTML = "";  // Pulire il tabellone
        for (let riga = 0; riga < righe; riga++) {
            for (let colonna = 0; colonna < colonne; colonna++) {
                let cella = document.createElement("div");
                cella.classList.add("cella");
                cella.dataset.riga = riga;
                cella.dataset.colonna = colonna;
                cella.addEventListener("click", gestisciClickCella);
                tabelloneGioco.appendChild(cella);
            }
        }
    }

    function gestisciClickCella(e) {
        let colonna = e.target.dataset.colonna;
        for (let riga = righe - 1; riga >= 0; riga--) {
            if (!tabellone[riga][colonna]) {
                tabellone[riga][colonna] = giocatoreCorrente;
                let cella = document.querySelector(
                    `.cella[data-riga="${riga}"][data-colonna="${colonna}"]`
                );
                cella.classList.add(giocatoreCorrente);
                
                console.log(`Giocatore ${giocatoreCorrente} ha posizionato un pezzo in riga ${riga}, colonna ${colonna}`);
                
                if (controllaVittoria(riga, colonna)) {
                    setTimeout(() => {
                        alert(`${giocatoreCorrente.toUpperCase()} ha vinto!`);
                        aggiornaStatisticheVittoria(giocatoreCorrente);
                        disabilitaTabellone();
                    }, 10);
                } else if (controllaPareggio()) {
                    setTimeout(() => {
                        alert("Pareggio!");
                        aggiornaStatistichePareggio();
                        disabilitaTabellone();
                    }, 10);
                } else {
                    giocatoreCorrente = giocatoreCorrente === "rosso" ? "giallo" : "rosso";
                }
                break;
            }
        }
    }

    function controllaVittoria(riga, colonna) {
        console.log(`Controllo vittoria per riga ${riga}, colonna ${colonna}`);
        return (
            controllaDirezione(riga, colonna, 1, 0) || // Controlla in verticale
            controllaDirezione(riga, colonna, 0, 1) || // Controlla in orizzontale
            controllaDirezione(riga, colonna, 1, 1) || // Controlla in diagonale (\)
            controllaDirezione(riga, colonna, 1, -1)   // Controlla in diagonale (/)
        );
    }

    function controllaDirezione(riga, colonna, direzioneRiga, direzioneColonna) {
        let contatore = 1; // Inizia con 1 per contare la cella attuale
        let r = riga + direzioneRiga;
        let c = colonna + direzioneColonna;

        // Controlla avanti
        while (r >= 0 && r < righe && c >= 0 && c < colonne && tabellone[r][c] === giocatoreCorrente) {
            contatore++;
            r += direzioneRiga;
            c += direzioneColonna;
        }

        // Resetta per controllare indietro
        r = riga - direzioneRiga;
        c = colonna - direzioneColonna;

        while (r >= 0 && r < righe && c >= 0 && c < colonne && tabellone[r][c] === giocatoreCorrente) {
            contatore++;
            r -= direzioneRiga;
            c -= direzioneColonna;
        }

        console.log(`Controllo direzione (${direzioneRiga}, ${direzioneColonna}): contatore = ${contatore}`);

        return contatore >= 4;
    }

    function controllaPareggio() {
        let pareggio = tabellone.every(riga => riga.every(cella => cella !== null));
        console.log(`Controllo pareggio: ${pareggio}`);
        return pareggio;
    }

    function aggiornaStatisticheVittoria(giocatore) {
        if (giocatore === "rosso") {
            statistiche.vittorieRosso++;
        } else {
            statistiche.vittorieGiallo++;
        }
        salvaStatistiche();
        aggiornaStatisticheVisualizzate();
    }

    function aggiornaStatistichePareggio() {
        statistiche.pareggi++;
        salvaStatistiche();
        aggiornaStatisticheVisualizzate();
    }

    function disabilitaTabellone() {
        let celle = document.querySelectorAll(".cella");
        celle.forEach(cella => cella.removeEventListener("click", gestisciClickCella));
    }

    document.getElementById("ricomincia-btn").addEventListener("click", () => {
        tabellone = Array.from({ length: righe }, () => Array(colonne).fill(null));
        giocatoreCorrente = "rosso";
        creaTabellone();
    });

    // Inizializza il gioco
    creaTabellone();
    aggiornaStatisticheVisualizzate();
});
