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
