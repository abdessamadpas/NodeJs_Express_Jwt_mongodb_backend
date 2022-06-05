const express = require('express');
const GModel = require('../models/group');
const jwt = require('jsonwebtoken');

const router = express.Router();



const CreateGroup = router.post('/Create', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403).json({
                message: "Authentication failed try to login "
            })

        } else {
            const Group = req.body;
            GModel.create(Group).then((result) => {
                // res.sendStatus(200)
                res.status(200).json(
                    result
                )
            }).catch((err) => res.status(500).json({
                error: err.message
            }))
        }

    })
})


const UpdateGroup = router.put('/Update/:id', verifyToken, async (req, res, next) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403).json({
                message: "Authentication failed try to login "
            })

        } else {
            GModel.updateOne({ _id: req.params.id }, req.body, { new: true }, (err, newGroup) => {
                if (err) next(err)
                res.status(200)
                res.json({
                    message: "✔ update succeeded ✔"
                })
            })
        }

    })
})


const Addtasks = router.put('/UpdateTasks/:id', verifyToken, async (req, res, next) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403).json({
                message: "Authentication failed try to login "
            })

        } else {
            currentGroup = await GModel.findById(req.params.id).exec();
            console.log(currentGroup);
            currentGroup.tasks.push(req.body.new)
            GModel.updateOne({ _id: req.params.id }, currentGroup, { new: true }, (err, newGroup) => {
                if (err) next(err)
                res.status(200)
                res.json({
                    message: "✔ task Added with success ✔"
                })
            })
        }

    })
})

const DeleteGroup = router.delete('/Delete/:id', verifyToken, async (req, res, next) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403).json({
                message: "Authentication failed try to login "
            })

        } else {
            GModel.findByIdAndRemove({ _id: req.params.id }, (err, DeleteGroup) => {
                if (err) next(err)
                res.status(200)
                res.json({
                    message: "🪓 Group Deleted 🧨"
                })
            })
        }

    })


})



const getAllGroups = router.get('/', verifyToken, (req, res, next) => {


    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })

        } else {
            await GModel.find().sort().populate("tasks").populate('leader').populate('member')
                .then((data) => {
                    res.status(200);
                    res.json({
                        Groups: data,
                    })

                })
        }

    })
})


const getOne = router.get('/:id', verifyToken, (req, res, next) => {


    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })

        } else {
            currentGroup = await GModel.findById(req.params.id).populate("tasks").populate('leader').populate('member').exec()
            res.status(200);
            res.json({
                Groups: currentGroup,
            })

        }

    })
})



function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];

        // Set the token

        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.status(403)
        next({
            message: "Forbidden you have to login first bro"
        })
    }

}



module.exports = {
    getAllGroups,
    CreateGroup,
    DeleteGroup,
    UpdateGroup,
    getOne
}