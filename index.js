import express from "express";
import * as http from 'http'
import { Server } from "socket.io";
import axiosClient from "./src/Libraries/axiosClient.js";


const app = express()

const server = http.Server(app)
const io = new Server(server, {
    cors:{
        origin:'*',
        allowedHeaders:['room_id', 'user_id', 'username']
    }
})

const ns_room = io.of('/room')

app.get('/', (req,res) => {
    ns_room.emit('chat_message', 'Requête')
    return res.json({success:'Joined Room'})
})


ns_room.on('connection', (socket) => {
    var handshake = socket.request
    const roomID = handshake.headers.room_id
    const userID = handshake.headers.user_id
    const username = handshake.headers.username

    socket.join(roomID)
    socket.data.userID = userID
    socket.data.username = username

    axiosClient.post('/room/join', {
        roomID:roomID,
        userID:userID
    }).then(res => {}).catch(err => {})

    socket.on('chat_message', (msg) => {
        ns_room.to(roomID).emit('chat_message', {
            sender: socket.data.username,
            msg: msg
        })
    })

    socket.on('disconnect',() => {
        axiosClient.post('/room/left', {
            roomID:roomID,
            userID:userID
        }).then(res => {}).catch(err => {})
    })
})

server.listen(3000, () => {
    console.log('Server Ready');
})