document.addEventListener('DOMContentLoaded', function() {
    // --- Kollaps-funktionalitet ---
    const toggles = document.querySelectorAll('.collapsible-toggle');

    toggles.forEach(toggle => {
        const content = toggle.nextElementSibling; // Får fat i den næste bror (collapsible-content)
        const arrow = toggle.querySelector('.arrow');

        // Skjul indholdet som standard ved sideindlæsning
        if (content && content.classList.contains('collapsible-content')) {
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
            content.style.paddingTop = '0';
            content.style.paddingBottom = '0';
            content.style.transition = 'max-height 0.3s ease-out, padding 0.3s ease-out';
            
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)'; // Pil ned, når indhold er skjult
                arrow.style.transition = 'transform 0.3s ease-out';
            }
        }

        toggle.addEventListener('click', function() {
            const content = this.nextElementSibling; // Får fat i den næste bror (collapsible-content)
            const arrow = this.querySelector('.arrow'); // Får fat i pilen inden i toggle

            if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
                // Udvid indhold
                const contentPaddingTop = parseFloat(window.getComputedStyle(content).paddingTop);
                const contentPaddingBottom = parseFloat(window.getComputedStyle(content).paddingBottom);
                content.style.maxHeight = (content.scrollHeight + contentPaddingTop + contentPaddingBottom) + 'px';
                
                content.style.paddingTop = '15px'; // Match CSS
                content.style.paddingBottom = '15px'; // Match CSS
                
                if (arrow) {
                    arrow.style.transform = 'rotate(180deg)'; // Roter pilen op
                }
            } else {
                // Skjul indhold
                content.style.maxHeight = '0';
                content.style.paddingTop = '0';
                content.style.paddingBottom = '0';
                if (arrow) {
                    arrow.style.transform = 'rotate(0deg)'; // Roter pilen ned
                }
            }
        });
    });

    // --- Afkrydsnings-funktionalitet ---
    const completionToggles = document.querySelectorAll('.completion-toggle');
    const storageKey = 'trainingProgress'; // Nøgle til LocalStorage

    // Funktion til at gemme fremskridt
    function saveProgress(id, isCompleted) {
        let progress = JSON.parse(localStorage.getItem(storageKey)) || {};
        progress[id] = isCompleted;
        localStorage.setItem(storageKey, JSON.stringify(progress));
    }

    // Funktion til at indlæse fremskridt
    function loadProgress() {
        let progress = JSON.parse(localStorage.getItem(storageKey)) || {};
        completionToggles.forEach(toggle => {
            const listItem = toggle.closest('li'); // Få fat i det overordnede li-element
            const id = listItem.dataset.id; // Få data-id fra li-elementet

            if (progress[id]) { // Hvis det er markeret som completed i storage
                listItem.classList.add('completed');
            } else {
                listItem.classList.remove('completed'); // Sikkerhed, hvis det var markeret, men nu er fjernet fra storage
            }
        });
    }

    // Tilføj event listener til hver toggle
    completionToggles.forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.stopPropagation(); // Forhindrer at klikket udløser collapsible-toggle også
            const listItem = this.closest('li'); // Få fat i det overordnede li-element
            const id = listItem.dataset.id; // Få data-id fra li-elementet

            // Toggle 'completed' klassen
            const isCompleted = listItem.classList.toggle('completed');
            
            // Gem status i LocalStorage
            saveProgress(id, isCompleted);
        });
    });

    // Indlæs fremskridt, når siden indlæses
    loadProgress();
});
