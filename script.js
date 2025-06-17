document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.collapsible-toggle');

    toggles.forEach(toggle => {
        // Skjul indholdet som standard, undtagen for den første uge
        const content = toggle.nextElementSibling; // Får fat i den næste bror (collapsible-content)
        if (content && content.classList.contains('collapsible-content')) {
            content.style.maxHeight = '0'; // Sætter højden til 0 for at skjule
            content.style.overflow = 'hidden'; // Skjuler overløbende indhold
            content.style.transition = 'max-height 0.3s ease-out, padding 0.3s ease-out'; // Glat overgang
            content.style.paddingTop = '0';
            content.style.paddingBottom = '0';
            // Opdater pilen til at pege ned (skjult indhold)
            const arrow = toggle.querySelector('.arrow');
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)';
                arrow.style.transition = 'transform 0.3s ease-out';
            }
        }

        toggle.addEventListener('click', function() {
            const content = this.nextElementSibling; // Får fat i den næste bror (collapsible-content)
            const arrow = this.querySelector('.arrow'); // Får fat i pilen inden i toggle

            if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
                // Udvid indhold
                content.style.maxHeight = content.scrollHeight + 'px'; // Sæt max-height til indholdets fulde højde
                content.style.paddingTop = '15px'; // Tilføj padding tilbage
                content.style.paddingBottom = '15px'; // Tilføj padding tilbage
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
});
