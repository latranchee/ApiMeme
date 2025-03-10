const express = require('express');
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');

const app = express();
const PORT = process.env.PORT || 3000;

// Dossier des templates de mèmes
const TEMPLATES_DIR = path.join(__dirname, 'templates', 'images');

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour la journalisation basique
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Route pour obtenir la liste des templates disponibles
app.get('/api/templates', (req, res) => {
    try {
        // Lire le contenu du dossier des templates
        const files = fs.readdirSync(TEMPLATES_DIR);
        
        // Filtrer pour ne garder que les fichiers PNG
        const templates = files
            .filter(file => file.toLowerCase().endsWith('.png'))
            .map(file => {
                const id = file.replace('.png', '');
                // Convertir le nom de fichier en nom plus lisible
                const name = id
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase());
                
                return { id, name };
            });
        
        res.json(templates);
    } catch (error) {
        console.error('Erreur lors de la lecture des templates:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des templates' });
    }
});

// Route pour générer un mème
app.get('/api/meme', (req, res) => {
    const { template, top, bottom } = req.query;
    
    if (!template) {
        return res.status(400).json({ error: 'Le paramètre template est requis' });
    }
    
    const templatePath = path.join(TEMPLATES_DIR, `${template}.png`);
    
    // Vérifier si le template existe
    if (!fs.existsSync(templatePath)) {
        return res.status(404).json({ error: 'Template non trouvé' });
    }
    
    // Utiliser des promesses explicites avec Jimp
    new Promise((resolve, reject) => {
        Jimp.read(templatePath, (err, image) => {
            if (err) {
                console.error('Erreur lors de la lecture de l\'image:', err);
                return reject(err);
            }
            
            const width = image.getWidth();
            const height = image.getHeight();
            
            // Charger la police
            Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
                .then(font => {
                    // Ajouter le texte du haut
                    if (top) {
                        const topText = decodeURIComponent(top);
                        const textWidth = Jimp.measureText(font, topText);
                        const x = (width - textWidth) / 2;
                        image.print(font, x, 20, topText);
                    }
                    
                    // Ajouter le texte du bas
                    if (bottom) {
                        const bottomText = decodeURIComponent(bottom);
                        const textWidth = Jimp.measureText(font, bottomText);
                        const x = (width - textWidth) / 2;
                        image.print(font, x, height - 60, bottomText);
                    }
                    
                    // Convertir l'image en buffer
                    image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                        if (err) {
                            console.error('Erreur lors de la conversion en buffer:', err);
                            return reject(err);
                        }
                        
                        resolve(buffer);
                    });
                })
                .catch(err => {
                    console.error('Erreur lors du chargement de la police:', err);
                    reject(err);
                });
        });
    })
    .then(buffer => {
        res.set('Content-Type', 'image/png');
        res.send(buffer);
    })
    .catch(error => {
        console.error('Erreur lors de la génération du mème:', error);
        res.status(500).json({ error: 'Erreur lors de la génération du mème' });
    });
});

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
}); 