document.addEventListener('DOMContentLoaded', function() {
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
            // Sørg for transition er sat, selvom det er skjult
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
                // Beregn den samlede højde, inklusiv padding
                const contentPaddingTop = parseFloat(window.getComputedStyle(content).paddingTop);
                const contentPaddingBottom = parseFloat(window.getComputedStyle(content).paddingBottom);
                content.style.maxHeight = (content.scrollHeight + contentPaddingTop + contentPaddingBottom) + 'px';
                
                content.style.paddingTop = '15px'; // Tilføj padding tilbage (match CSS)
                content.style.paddingBottom = '15px'; // Tilføj padding tilbage (match CSS)
                
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
