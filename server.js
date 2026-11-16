require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Route pour recevoir les commandes du site web
app.post('/api/commande', async (req, res) => {
    try {
        // 1. Préparation des données pour Supabase
        const orderData = {
            p_api_key: process.env.API_KEY_CLIENT,
            p_produit_id: process.env.PRODUIT_ID,
            p_nom_client: req.body.nom,
            p_telephone: req.body.telephone,
            p_wilaya: req.body.wilaya,
            p_commune: req.body.commune,
            p_quantite: req.body.quantite
        };

        // 2. Envoi sécurisé vers ton back-office Supabase
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/creer_commande_site`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.SUPABASE_ANON_KEY
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de la communication avec Supabase");
        }

        // 3. Réponse de succès au frontend
        res.status(200).json({ success: true, message: "Commande insérée avec succès dans le Dashboard" });

    } catch (error) {
        console.error("Erreur commande:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
