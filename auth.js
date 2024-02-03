const hashedSecret = require('./config')
const jwt = require ('jsonwebtoken');


function generateToken(user){
    return jwt.sign({user: user.id}, hashedSecret, {expiresIn:'1h'})
}

function verifyToken(req, res, next) {
    const token = req.session.token
    if(!token) {
        return res.status(401).json({mensaje : 'Token no generado'})
    }
    jwt.verify(token, hashedSecret, (err, decoded) => {
        if(err) {
            return res.status(401).json({mensaje:'token invalido'})
        }
        req.user = decoded.user
            
        })
    next()
}


module.exports = {generateToken, verifyToken}


// async function registerUser(username,pasword) {
//     try{
//         const hashedPasword = await bcrypt.hash(password,10);
//         console.log('Usuario registrado:', {usename , hashedPasword});
//     } catch (error) {
//         console.error('Error al registrar el usuario',error);

//     }
// }

// async function loginUser (username, password) {
//     try {
//         const storedHash = ''
//         const passwordValid = await bcrypt.compare(password,storedHash);

//         if(passwordValid) {
//             const token = jwt.sign({username} , 'secretkey', {expiresIn: '1h'});
//             console.log('Inicio de sesion exitoso.Token generado:' + token);
//             return token;
//         } else {
//             console.log('Inicio de sesion fallido.Contraseña incorrecta');
//             return null;
//         } 
//     } catch (error) {
//         console.error('Error al verificar el token:' + error);
//         return null;
//     }
// }
// (async () => {
//     await registerUser ('usuario1','password');
//     const token = await loginUser ('usuario1','password');

//     if (token) {
//         verifyToken(token);
//     }
// })();
// module.exports = {registerUser, loginUser}


