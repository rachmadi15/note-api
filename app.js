const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const mongoose = require('./database/database');
const User = require('./database/model/user');
const Note = require('./database/model/note');


// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect 
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');

    // Pass to next layer of middleware
    next();
});



app.use(express.json());


app.post('/registrasi', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let userObj = { username: username, email: email, password: hashedPassword };
    User.insertMany(userObj).then((user) => {
        res.status(201).send(user);
    }).catch((err)=> {
        console.log(err);
    })
});

app.post("/login", (req, res) => {
    User.find({ username: req.body.username }).then( async (user) => {
        if (!user) {
            res.status(404).send("User does not exist!");
        } 
        if(await bcrypt.compare(req.body.password, user[0].password)) {
            const accessToken = generateAccessToken({user_id: user[0]._id})
            const refreshToken = generateRefreshToken({user_id: user[0]._id})
            res.status(200).send({accessToken: accessToken, refreshToken: refreshToken})
        } else {
            res.status(401).send('Password Incorrect!');
        }    
    }).catch((err) => {
        console.log(err);
    });
    
})


// CRUD For Note
app.get("/note", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    if(token == null){
        res.status(400).send("Token Required");
    }
    jsonwebtoken.verify(token, "3e9af42de397cfc9387a06972c28c23a1ac7e9a60fb6dc1f05295bc6057baf500672d4a13db5d04ea84bbc4c5679164a7723f3d49f516bb73dc3df6e3b768c8e", (err, user) => {
        if(err){
            res.status(400).send("Token Invalid");
        } else {
            req.user = user;
        }
    })
    Note.find({ userId: req.user.user_id }).then((list) => {
        res.status(200).send(list);
    }).catch((err) => {
        console.log(err);
    })
})


app.post("/note", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    if(token == null){
        res.status(400).send("Token Required");
    }
    jsonwebtoken.verify(token, "3e9af42de397cfc9387a06972c28c23a1ac7e9a60fb6dc1f05295bc6057baf500672d4a13db5d04ea84bbc4c5679164a7723f3d49f516bb73dc3df6e3b768c8e", (err, user) => {
        if(err){
            res.status(400).send("Token Invalid");
        } else {
            req.user = user;
        }
    })

    let noteObj = { 'title': req.body.title, 'content': req.body.content, 'userId': req.user.user_id };
    Note.insertMany(noteObj).then((note) => {
        res.status(201).send(note);
    }).catch((err) => {
        console.log(err);
    })
})

app.get('/note/:id', (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    if(token == null){
        res.status(400).send("Token Required");
    }
    jsonwebtoken.verify(token, "3e9af42de397cfc9387a06972c28c23a1ac7e9a60fb6dc1f05295bc6057baf500672d4a13db5d04ea84bbc4c5679164a7723f3d49f516bb73dc3df6e3b768c8e", (err, user) => {
        if(err){
            res.status(400).send("Token Invalid");
        } else {
            req.user = user;
        }
    })
    Note.find({ _id: req.params.id }).then((note) => {
        res.status(200).send(note);
    }).catch((err) => {
        console.log(err);
    });
});

app.put('/note/:id', (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    if(token == null){
        res.status(400).send("Token Required");
    }
    jsonwebtoken.verify(token, "3e9af42de397cfc9387a06972c28c23a1ac7e9a60fb6dc1f05295bc6057baf500672d4a13db5d04ea84bbc4c5679164a7723f3d49f516bb73dc3df6e3b768c8e", (err, user) => {
        if(err){
            res.status(400).send("Token Invalid");
        } else {
            req.user = user;
        }
    })
    Note.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }).then((note) => {
        res.status(200).send(req.body);
    }).catch((err) => {
        console.log(err);
    })
});


app.delete('/note/:id', (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    if(token == null){
        res.status(400).send("Token Required");
    }
    jsonwebtoken.verify(token, "3e9af42de397cfc9387a06972c28c23a1ac7e9a60fb6dc1f05295bc6057baf500672d4a13db5d04ea84bbc4c5679164a7723f3d49f516bb73dc3df6e3b768c8e", (err, user) => {
        if(err){
            res.status(400).send("Token Invalid");
        } else {
            req.user = user;
        }
    })
    Note.findByIdAndDelete(req.params.id).then((note) => {
        res.status(200).send(note);
    }).catch((err) => {
        console.log(err)
    });
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