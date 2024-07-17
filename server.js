const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let quizzes = [];
let users = [];

app.post('/create-quiz', (req, res) => {
    const { title, questions } = req.body;
    quizzes.push({ title, questions });
    res.json({ success: true });
});

app.get('/quizzes', (req, res) => {
    res.json(quizzes);
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    res.json({ success: true });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
