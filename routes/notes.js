const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('../database/database');
const User = require('../database/model/user');
const Note = require('../database/model/note');

const jsonwebtoken = require('jsonwebtoken');

// CRUD For Note

/**
 * @swagger
 * components:
 *      schemas:
 *          Note:
 *              type: object
 *              required: 
 *                  - title
 *                  - content
 *              properties:
 *                  id: 
 *                      type: string
 *                      description: The auto-generated id of the book
 *                  title:
 *                      type: string
 *                      description: The Note Title
 *                  content:
 *                      type: string
 *                      description: The Note Content
 *                  userId:
 *                      type: string
 *                      description: The ID From User Write Content
 *              Example:
 *                  id: d5fe_asdasda
 *                  title: Catatan Awal
 *                  Content: <strong>Catatan Aawal</strong>
 *                  userId: 1ada8a0s0asd8oo
 * 
 * 
 *
 */


/**
 * @swagger
 * components:
 *      schemas:
 *          NotePost:
 *              type: object
 *              required: 
 *                  - title
 *                  - content
 *              properties:
 *                  title:
 *                      type: string
 *                      description: The Note Title
 *                  content:
 *                      type: string
 *                      description: The Note Content
 *              Example:
 *                  title: Catatan Awal
 *                  Content: <strong>Catatan Aawal</strong>
 * 
 * 
 *
 */



/**
 * 
 * @swagger
 * /note:
 *      get:
 *          summary: Return the lists of all the notes
 *          tags: [Note]
 *          responses:
 *              200:
 *                  description: The list of the notes by user
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items: 
 *                                  $ref: '#components/schemas/Note'
 * 
 * 
 */

router.get("/", (req, res) => {
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


/**
 * 
 * @swagger
 * /note:
 *      post:
 *          summary: Create a new note
 *          tags: [Note]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/NotePost'
 *          responses:
 *              200:
 *                  description: Success create a note
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/Note'
 *              400:
 *                  description: Token Invalid
 *                  
 * 
 */

router.post("/", (req, res) => {
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


/**
 * 
 * @swagger
 * /note/:id:
 *      get:
 *          summary: Return the list of note by ID
 *          tags: [Note]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                  description: The Note ID
 *          responses:
 *              200:
 *                  description: The note description by id
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              $ref: '#components/schemas/Note'
 *              404:
 *                  description: The note not found
 * 
 */

router.get('/:id', (req, res) => {
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


/**
 * 
 * @swagger
 * /note/:id:
 *      put:
 *          summary: Update the note by the id
 *          tags: [Note]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                      required: true
 *                      description: The note id
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/NotePost'
 *          responses:
 *              200:
 *                  description: The note was updated
 *              400:
 *                  description: Token Invalid
 */


router.put('/:id', (req, res) => {
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

/**
 * 
 * @swagger
 * /note/:id:
 *      delete:
 *          summary: Remove the note by id
 *          tags: [Note]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema: 
 *                  type: string
 *                  required: true
 *                  description: The note Id
 *          responses:
 *              200:
 *                  description: The note was deleted
 *              400:
 *                  description: Token Invalid
 * 
 */


router.delete('/:id', (req, res) => {
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

module.exports = router