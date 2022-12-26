const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

app.use(express.json());


const users = [];

app.post('/registrasi', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({ username: username, email: email, password: hashedPassword });
    res.status(201).send(users);
});

app.post("/login", async (req, res) => {
    const user = users.find(x => x.username == req.body.username);
    if (user == null) {
        res.status(404).send("User does not exist!");
    } 
    if(await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = generateAccessToken({user_id: user._id})
        const refreshToken = generateRefreshToken({user_id: user._id})
        res.status(200).send({accessToken: accessToken, refreshToken: refreshToken})
    } else {
        res.status(401).send('Password Incorrect!');
    }
})



// accessTokens
function generateAccessToken(user) {
    return jsonwebtoken.sign(user, "3e9af42de397cfc9387a06972c28c23a1ac7e9a60fb6dc1f05295bc6057baf500672d4a13db5d04ea84bbc4c5679164a7723f3d49f516bb73dc3df6e3b768c8e", {expiresIn: "15m"}) 
}

// refreshTokens
let refreshTokens = []
function generateRefreshToken(user) {
    const refreshToken = jsonwebtoken.sign(user, "56a6d157ad7d2ee09e480960ae857e528ae546d156f47433b1afad162311c45aa520697b65d13a5c72891f6145ab1f2675886fc124027dc95f86073dd8fe1462", {expiresIn: "20m"})
    refreshTokens.push(refreshToken)
    return refreshToken
}

app.listen(3000, () => {
    console.log('Server Running');
})