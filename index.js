import express, { json } from "express";
import cors from "cors";
import fs from "fs";

const server = express();

server.use(cors());
server.use(express.json());

let users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
let tweets = JSON.parse(fs.readFileSync('tweets.json', 'utf-8'));

server.post('/sign-up', (request, response) => {

    const user = request.body;

    if (!request.body.username || !request.body.avatar) {
        response.status(400).send("Todos os campos são obrigatórios!");
    }

    users.push(user);
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
    response.send("OK")
})

server.get('/tweets', (request, response) => {
    const visibleTweets = [];
    for (let i = tweets.length - 1; i > 0; i--) {
        visibleTweets.push({
            username: users[0].username,
            avatar: users[0].avatar,
            tweet: tweets[i].tweet,
        });
        if (visibleTweets.length === 10) {
            break
        }
    }
    response.send(visibleTweets);
})
server.post('/tweets', (request, response) => {

    const tweet = request.body;

    if (!request.body.username || !request.body.tweet) {
        response.status(400).send("Todos os campos são obrigatórios!");
    }
    
    tweets.push(tweet);
    fs.writeFileSync('tweets.json', JSON.stringify(tweets, null, 2));

    response.send('OK');
})









server.listen(5000);