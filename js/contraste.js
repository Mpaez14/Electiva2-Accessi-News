document.addEventListener("DOMContentLoaded", () => {
    const contrastModal = new bootstrap.Modal(document.getElementById('contrastModal'));
    const applyContrastBtn = document.getElementById('applyContrastBtn');

    const openContrastModalBtn = document.getElementById('openContrastModal'); 
    if (openContrastModalBtn) {
        openContrastModalBtn.addEventListener('click', function() {
            contrastModal.show();
        });
    }

    applyContrastBtn.addEventListener("click", () => {
        const selectedContrast = document.querySelector('input[name="contrastOption"]:checked').value;
        const header = document.querySelector('header');  


        switch (selectedContrast) {
            case 'high':
                document.body.classList.add("high-contrast");
                document.body.classList.remove("light-mode");
                header.style.backgroundColor = 'yellow'; 
                break;
            case 'light':
                header.style.backgroundColor = '#c2c2c2'; 
                document.body.classList.add("light-mode");
                document.body.classList.remove("high-contrast");
                document.body.classList.remove("dark-mode");
                
                break;
            case 'dark':
                header.style.backgroundColor = '#000'; 
                document.body.classList.add("dark-mode");
                document.body.classList.remove("high-contrast");
                document.body.classList.remove("light-mode");
                
                break;
            case 'normal':
                document.body.classList.remove("high-contrast", "light-mode", "dark-mode");
                header.style.backgroundColor = '#2c5e78'; 
                break;
        }

        contrastModal.hide();
    });
});
