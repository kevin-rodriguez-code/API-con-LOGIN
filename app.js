const express = require('express');
const axios = require('axios');
const router = require('./routes')


const app = express();
const port = 4000; 

app.use(router)

app.get('/characters', (req, res) => {
    res.send('Cocreta!');
});

app.get('/characters/:characterName', async (req, res) => {
    const characterName = req.params.characterName;
    const apiUrl = `https://rickandmortyapi.com/api/character/?name=${characterName}`;

    try {
        const response = await axios.get(apiUrl);
        const characterData = response.data.results[0];

        if (!characterData) {
            throw new Error('Personaje no encontrado');
        }

        const { name, status, species, gender, origin, image } = characterData;
        res.json({ name, status, species, gender, origin: origin.name, image });
    } catch (error) {
        res.status(404).json({ error: 'Personaje no encontrado' });
    }
});

app.listen(4000, () => {
    console.log(`express está escuchando en el puerto http://localhost:4000`);
});
