import express, { json } from "express";
import cors from "cors";
import fs from "fs";

const server = express();

server.use(cors());
server.use(express.json());

let users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

server.post('/sign-up', (request, response) => {

    const user = request.body;
    users.push(user);
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
    response.send("OK")
})











server.listen(5000);