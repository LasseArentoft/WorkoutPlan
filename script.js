document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Hjælpefunktion: Formater sekunder til MM:SS eller HH:MM:SS
       ========================================================================== */
    function formatTime(totalSeconds) {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.round(totalSeconds % 60);
        
        const formattedS = s < 10 ? '0' + s : s;
        
        if (h > 0) {
            const formattedM = m < 10 ? '0' + m : m;
            return `${h}:${formattedM}:${formattedS}`;
        }
        return `${m}:${formattedS}`;
    }

    /* ==========================================================================
       1. Standard Pace Beregner (Den oprindelige funktion)
       ========================================================================== */
    const paceForm = document.getElementById('pace-form');
    const resultBox = document.getElementById('result');
    const paceResult = document.getElementById('pace-result');

    if (paceForm) {
        paceForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const distance = parseFloat(document.getElementById('distance').value);
            const hours = parseInt(document.getElementById('hours').value) || 0;
            const minutes = parseInt(document.getElementById('minutes').value) || 0;
            const seconds = parseInt(document.getElementById('seconds').value) || 0;

            if (distance <= 0 || isNaN(distance)) {
                alert('Indtast venligst en gyldig distance større end 0.');
                return;
            }

            const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

            if (totalSeconds <= 0) {
                alert('Indtast venligst en gyldig tid.');
                return;
            }

            const secondsPerKm = totalSeconds / distance;
            
            // Brug vores hjælpefunktion til at formatere tiden
            paceResult.textContent = formatTime(secondsPerKm);
            resultBox.classList.remove('hidden');
        });
    }

    /* ==========================================================================
       2. Race Splits Beregner (Progressiv lineær strategi)
       ========================================================================== */
    const splitsForm = document.getElementById('splits-form');
    const splitsResultContainer = document.getElementById('splits-result');

    if (splitsForm) {
        splitsForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Hent data
            const D = parseFloat(document.getElementById('split-distance').value);
            const hours = parseInt(document.getElementById('split-h').value) || 0;
            const minutes = parseInt(document.getElementById('split-m').value) || 0;
            const seconds = parseInt(document.getElementById('split-s').value) || 0;
            const X = parseFloat(document.getElementById('start-delay').value) || 0;
            
            // Samlet måltid i sekunder (T)
            const T = (hours * 3600) + (minutes * 60) + seconds;

            // Validering
            if (D <= 0 || T <= 0 || isNaN(D) || isNaN(T)) {
                alert('Indtast venligst en gyldig distance og tid.');
                return;
            }
            if (D <= 1 && X > 0) {
                alert('Lineær progression kræver en distance over 1 km.');
                return;
            }

            // Matematikken
            const P_avg = T / D;
            const S = (2 * X) / (D - 1); // Trinnet vi trækker fra pr. km

            // Generering af loop og tabel
            let accumulatedTime = 0;
            let tableHTML = `
                <h3>Måltid: ${formatTime(T)}</h3>
                <p style="text-align:center; font-size: 0.9em; margin-bottom: 15px;">
                   Gennemsnitspace: ${formatTime(P_avg)} min/km <br>
                   Første km: ${formatTime(P_avg + X)} min/km
                </p>
                <table class="pace-band">
                    <thead>
                        <tr>
                            <th>Km</th>
                            <th>Pace</th>
                            <th>Samlet Tid</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            const totalRounds = Math.ceil(D);

            for (let i = 1; i <= totalRounds; i++) {
                // Beregn pace for denne specifikke kilometer
                let currentPace = (P_avg + X) - ((i - 1) * S);
                
                let stepFraction = 1;
                let displayKm = i;
                
                // Håndtering af skæve slut-distancer
                if (i > D) {
                    stepFraction = D - (i - 1);
                    displayKm = D; 
                }

                accumulatedTime += (currentPace * stepFraction);

                tableHTML += `
                    <tr>
                        <td>${displayKm}</td>
                        <td>${formatTime(currentPace)}</td>
                        <td>${formatTime(accumulatedTime)}</td>
                    </tr>
                `;
            }

            tableHTML += `</tbody></table>`;
            
            splitsResultContainer.innerHTML = tableHTML;
            splitsResultContainer.classList.remove('hidden');
        });
    }
});
