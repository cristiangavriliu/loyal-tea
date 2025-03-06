import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import itemController from "./controllers/itemController.js";
import challengeController from "./controllers/challengeController.js";
import userController from "./controllers/userController.js";
import orderController from "./controllers/orderController.js";
import gameController from "./controllers/gameController.js";
import paymentController from "./controllers/paymentController.js";
import {Order} from './models/orderModel.js'
import {Challenge} from './models/challengeModel.js'
import {Server as SocketIOServer} from 'socket.io';
import http from 'http';
import cookieParser from "cookie-parser";
import {User} from "./models/userModel.js";

const url = "mongodb+srv://dbreader:brwhs6gEkfI7hnsp@ltdata.sessgus.mongodb.net/puzzels_data?retryWrites=true&w=majority&appName=ltdata";

const PORT = 8080;

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

app.use("/items", itemController);
app.use("/challenges", challengeController);
app.use("/user", userController);
app.use("/orders", orderController);
app.use("/games", gameController);
app.use("/payments", paymentController);

// Connect to database
mongoose.connect(url).then(() => {
    server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server listening on ${PORT}`)
    })
    const changeStream = Order.watch();
    changeStream.on('change', (change) => {
        io.emit('orderChange', change);
    });

    const challengeChangeStream = Challenge.watch();
    challengeChangeStream.on('change', (change) => {
        io.emit('challengeChange', change);

        // Check if the change involves the 'participants' field
        if (change.updateDescription && change.updateDescription.updatedFields.hasOwnProperty('participantsCount')) {
            const challengeId = change.documentKey._id;
            io.emit('challengeParticipantsChange', change);
        }
    });

    const userChangeStream = User.watch();
    userChangeStream.on('change', (change) => {
        if (change.updateDescription && change.updateDescription.updatedFields.hasOwnProperty('puzzles')) {
            // Extracting the user's ID from the change event
            const userId = change.documentKey._id;
            // Emitting the change event with the user's ID
            io.emit('puzzlesChange', {userId, change});
        }
    });

}).catch((error) => {
    console.log(error)
})



