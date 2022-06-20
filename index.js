import express from "express";
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
        response.sendStatus(400);
        return
    }

    users.push(user);
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
    response.status(201).send("Logado com sucesso!");
    response.send("OK")
})

server.get('/tweets', (request, response) => {

    const page = request.query.page;
    const inicialIndex = tweets.length - 1 - (page-1)*10;
    if ( (page > 1 && inicialIndex < 1) || page < 1) {
        response.status(400).send("Informe uma página válida!");
        response.sendStatus(400);
        return
    }

    const visibleTweets = [];
    

    for (let i = inicialIndex; i >= 0; i--) {
        visibleTweets.push({
            username: tweets[i].username,
            avatar: users[0].avatar,
            tweet: tweets[i].tweet,
        });
        if (visibleTweets.length === 10) {
            break
        }
    }
    response.send(visibleTweets);
})
server.get('/tweets/:username', (request, response) => {

    const visibleTweets = [];
    const username = request.params.username;
    const userTweets = tweets.filter( tweet => tweet.username === username);

    for (let i = userTweets.length - 1; i >= 0; i--) {
        visibleTweets.push({
            username: username,
            avatar: users[0].avatar,
            tweet: userTweets[i].tweet,
        });
        if (visibleTweets.length === 10) {
            break
        }
    }
    response.send(visibleTweets);
})
server.post('/tweets', (request, response) => {

    const { tweet } = request.body;
    const user = request.header("User");

    if (!request.body.tweet) {
        response.status(400).send("Todos os campos são obrigatórios!");
        response.sendStatus(400);
        return
    }

    tweets.push({
        usename: user,
        tweet: tweet
    });
    fs.writeFileSync('tweets.json', JSON.stringify(tweets, null, 2));

    response.status(201).send("Tweet criado");
    response.send('OK');
})









server.listen(5000);