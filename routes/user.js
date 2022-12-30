const express = require('express');
const routerUser = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('../database/database');
const User = require('../database/model/user');
const Note = require('../database/model/note');

const jsonwebtoken = require('jsonwebtoken');


/**
 * @swagger
 * components:
 *      schemas:
 *          Registrasi:
 *              type: object
 *              required: 
 *                  - username
 *                  - email
 *                  - password
 *              properties:
 *                  username:
 *                      type: string
 *                      description: Username for user
 *                  email:
 *                      type: string
 *                      description: Email for user
 *                  password:
 *                      type: string
 *                      description: Password for user
 *              Example:
 *                  username: ronaldo232
 *                  email: ronaldo@gmail.com
 *                  userId: ronaldo123456
 * 
 * 
 *
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          Login:
 *              type: object
 *              required: 
 *                  - username
 *                  - password
 *              properties:
 *                  username:
 *                      type: string
 *                      description: Username for user
 *                  password:
 *                      type: string
 *                      description: Password for user
 *              Example:
 *                  username: ronaldo232
 *                  userId: ronaldo123456
 * 
 * 
 *
 */


/**
 * 
 * @swagger
 * /registrasi:
 *      post:
 *          summary: Create a new user
 *          tags: [Registrasi]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/Registrasi'
 *          responses:
 *              201:
 *                  description: Success create a user
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/Registrasi'
 *                  
 * 
 */


routerUser.post('/registrasi', async (req, res) => {
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


/**
 * 
 * @swagger
 * /login:
 *      post:
 *          summary: Login user
 *          tags: [Login]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/Login'
 *          responses:
 *              200:
 *                  description: Success Login
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/Login'
 *              401:
 *                  description: Password Inccorect
 *              404:
 *                  description: User does not exist
 *                  
 * 
 */

routerUser.post("/login", (req, res) => {
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

module.exports = routerUser