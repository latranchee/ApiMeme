document.addEventListener('DOMContentLoaded', () => {
    // Éléments du DOM
    const memeTemplateSelect = document.getElementById('memeTemplate');
    const topTextInput = document.getElementById('topText');
    const bottomTextInput = document.getElementById('bottomText');
    const memeLinkInput = document.getElementById('memeLink');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const memeImage = document.getElementById('memeImage');
    const noPreview = document.getElementById('noPreview');
    const apiLink = document.getElementById('apiLink');

    // Charger les templates de mèmes disponibles
    fetch('/api/templates')
        .then(response => response.json())
        .then(templates => {
            // Remplir le select avec les options
            templates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.id;
                option.textContent = template.name;
                memeTemplateSelect.appendChild(option);
            });
            
            // Mettre à jour le lien après le chargement des templates
            updateMemeLink();
        })
        .catch(error => {
            console.error('Erreur lors du chargement des templates:', error);
        });

    // Fonction pour mettre à jour le lien du mème
    function updateMemeLink() {
        const template = memeTemplateSelect.value;
        const topText = encodeURIComponent(topTextInput.value);
        const bottomText = encodeURIComponent(bottomTextInput.value);
        
        const baseUrl = window.location.origin;
        const memeUrl = `${baseUrl}/api/meme?template=${template}&top=${topText}&bottom=${bottomText}`;
        
        memeLinkInput.value = memeUrl;
        apiLink.href = memeUrl;
    }

    // Événements pour mettre à jour le lien
    memeTemplateSelect.addEventListener('change', updateMemeLink);
    topTextInput.addEventListener('input', updateMemeLink);
    bottomTextInput.addEventListener('input', updateMemeLink);

    // Événement pour générer le mème
    generateBtn.addEventListener('click', () => {
        const memeUrl = memeLinkInput.value;
        
        // Afficher l'image et masquer le message "pas d'aperçu"
        memeImage.src = memeUrl;
        memeImage.classList.remove('hidden');
        noPreview.classList.add('hidden');
    });

    // Événement pour télécharger le mème
    downloadBtn.addEventListener('click', () => {
        if (memeImage.src) {
            // Créer un lien temporaire pour télécharger l'image
            const downloadLink = document.createElement('a');
            downloadLink.href = memeImage.src;
            downloadLink.download = `meme-${memeTemplateSelect.value}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } else {
            alert('Veuillez d\'abord générer un mème.');
        }
    });
}); 