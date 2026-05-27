document.addEventListener('DOMContentLoaded', () => {
    const paceForm = document.getElementById('pace-form');
    const resultBox = document.getElementById('result');
    const paceResult = document.getElementById('pace-result');

    paceForm.addEventListener('submit', function(e) {
        // Forhindrer siden i at genindlæse
        e.preventDefault();

        // Hent værdier fra formen
        const distance = parseFloat(document.getElementById('distance').value);
        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;

        // Validering: Tjek om distancen er gyldig (større end 0)
        if (distance <= 0 || isNaN(distance)) {
            alert('Indtast venligst en gyldig distance større end 0.');
            return;
        }

        // Udregn samlet tid i sekunder
        const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

        // Tjek om der er indtastet en tid
        if (totalSeconds <= 0) {
            alert('Indtast venligst en gyldig tid.');
            return;
        }

        // Udregn sekunder per kilometer
        const secondsPerKm = totalSeconds / distance;

        // Konverter tilbage til minutter og sekunder for pace
        const paceMinutes = Math.floor(secondsPerKm / 60);
        let paceSeconds = Math.round(secondsPerKm % 60);

        // Formater sekunderne så der altid står to tal (f.eks. "05" i stedet for "5")
        if (paceSeconds < 10) {
            paceSeconds = '0' + paceSeconds;
        } else if (paceSeconds === 60) {
            // Hvis afrundingen rammer 60, læg et minut til
            paceMinutes += 1;
            paceSeconds = '00';
        }

        // Vis resultatet på siden
        paceResult.textContent = `${paceMinutes}:${paceSeconds}`;
        resultBox.classList.remove('hidden');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const splitsForm = document.getElementById('splits-form');
    const splitsResultContainer = document.getElementById('splits-result');

    // Hjælpefunktion til at formatere sekunder til MM:SS eller HH:MM:SS
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

    if(splitsForm) {
        splitsForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 1. Inputs: Hent data fra brugeren
            const D = parseFloat(document.getElementById('split-distance').value);
            const hours = parseInt(document.getElementById('split-h').value) || 0;
            const minutes = parseInt(document.getElementById('split-m').value) || 0;
            const seconds = parseInt(document.getElementById('split-s').value) || 0;
            
            // Konverter procent til decimal (P)
            const P = parseFloat(document.getElementById('split-percent').value) / 100;
            
            // Samlet måltid i sekunder (T)
            const T = (hours * 3600) + (minutes * 60) + seconds;

            if (D <= 0 || T <= 0) {
                alert('Indtast venligst en gyldig distance og tid.');
                return;
            }

            // 2. Backend: Udregn T1 og T2
            const T1 = T * (0.5 + (P / 2));
            const T2 = T * (0.5 - (P / 2));

            // Udregn Pace1 og Pace2 i sekunder pr. km
            const Pace1 = T1 / (D / 2);
            const Pace2 = T2 / (D / 2);

            // 3 & 4. Output: Generering af Pace Band
            let accumulatedTime = 0;
            let tableHTML = `
                <h3>Måltid: ${formatTime(T)}</h3>
                <p style="text-align:center; font-size: 0.9em; margin-bottom: 15px;">
                   Første halvdel: ${formatTime(Pace1)} min/km <br>
                   Anden halvdel: ${formatTime(Pace2)} min/km
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

            for (let km = 1; km <= totalRounds; km++) {
                // Tjek om vi er i første eller anden halvdel
                let currentPace = (km <= D / 2) ? Pace1 : Pace2;
                
                // Håndter skæve distancer (f.eks. de sidste 195 meter på et maraton)
                let stepFraction = 1;
                let displayKm = km;
                
                if (km > D) {
                    stepFraction = D - (km - 1);
                    displayKm = D; // Viser f.eks. "42.195" i stedet for "43"
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
            
            // Udskriv til skærmen
            splitsResultContainer.innerHTML = tableHTML;
            splitsResultContainer.classList.remove('hidden');
        });
    }
});
