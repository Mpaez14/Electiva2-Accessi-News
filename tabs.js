document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            // Encuentra el botón "Resumen" dentro de esta tarjeta y actívalo
            const resumenButton = card.querySelector('.btn-resumen');
            if (resumenButton) {
                resumenButton.click();
            }
        }
    });
});
