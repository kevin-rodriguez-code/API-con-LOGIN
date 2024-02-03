
const express = require('express');
const axios = require('axios');
const session = require('express-session');
const router = express.Router();
const users = require('./users');
const { generateToken, verifyToken } = require('./auth');
const hashedSecret = require('./config');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(
    session({
        secret: hashedSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

router.get('/', (req, res) => {
    const loginForm = `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        
        <form action="/login" method="post">
            <label for="username">Usuario:</label>
            <input type="text" id="username" name="username" required><br>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required><br>
            <button type="submit">Iniciar sesión</button>
        </form>
        <a href="/search">Búsqueda</a>

    </body>
    </html>

`;

    res.send(loginForm);
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/search');
    } else {
        res.status(401).json('Credenciales incorrectas');
    }
});

router.get('/search', verifyToken, (req, res) => {
    const userId = req.user;
    const user = users.find(user => user.id === userId);
    if (user) {
        res.send(`<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h1>Bienvenido</h1>
            <form action="/characters/:characterName" method="post">
            <label for="characterName">
            <input id="characterName" name="characterName" placeholder="Introduce el nombre del personaje" />
            <button type="submit">Buscar</button>
            </form>  
        </body>
        </html>
        `);
    } else {
        res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
});

router.post('/characters/:characterName', verifyToken, async (req, res) => {
    const characterName = req.body.characterName;
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

module.exports = router;
