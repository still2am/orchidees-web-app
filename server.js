const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const initDB = require('./db');

const app = express();
const saltRounds = 10;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

let db;
initDB().then(conn => { 
    db = conn; 
    console.log("Сервер запущен. База данных подключена.");
}).catch(err => console.error("Ошибка при подключении к БД:", err));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));

app.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone, gender } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await db.query(
            "INSERT INTO users (firstname, lastname, email, password, phone, gender) VALUES (?, ?, ?, ?, ?, ?)", 
            [firstname, lastname, email, hashedPassword, phone, gender]
        );
        req.session.userId = (await db.query("SELECT LAST_INSERT_ID() as id"))[0][0].id;
        res.status(200).send("success");
    } catch (err) { 
        console.error("Ошибка регистрации:", err);
        res.status(500).send("Ошибка"); 
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await db.query("SELECT id_user, password FROM users WHERE email = ?", [email]);
        if (rows.length > 0 && await bcrypt.compare(password, rows[0].password)) {
            req.session.userId = rows[0].id_user;
            res.status(200).send("success");
        } else {
            res.status(401).send("Ошибка");
        }
    } catch (err) { 
        console.error("Ошибка входа:", err);
        res.status(500).send("Ошибка"); 
    }
});

app.get('/api/profile', async (req, res) => {
    if (!req.session.userId) return res.status(401).send("Нет сессии");
    try {
        const [rows] = await db.query("SELECT id_user, firstname, lastname, email, phone, gender FROM users WHERE id_user = ?", [req.session.userId]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).send("Не найдено");
    } catch (err) { res.status(500).send("Ошибка"); }
});

app.post('/api/profile', async (req, res) => {
    if (!req.session.userId) return res.status(401).send("Нет сессии");
    try {
        const { firstname, lastname, email, phone } = req.body;
        await db.query(
            "UPDATE users SET firstname=?, lastname=?, email=?, phone=? WHERE id_user=?", 
            [firstname, lastname, email, phone, req.session.userId]
        );
        res.status(200).send("success");
    } catch (err) { res.status(500).send("Ошибка"); }
});

app.post('/api/order', async (req, res) => {
    if (!req.session.userId) return res.status(401).send("Нет сессии");
    try {
        const { firstName, lastName, address, phoneNumber, date, notes, flowerName, price } = req.body;
        
        const query = `INSERT INTO orders (id_user, recipient_firstname, recipient_lastname, address, phone, delivery_date, notes, flower_name, price) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [req.session.userId, firstName, lastName, address, phoneNumber, date, notes, flowerName, price];
        
        await db.query(query, values);
        res.status(200).send("success");
    } catch (err) { 
        console.error("КРИТИЧЕСКАЯ ОШИБКА SQL:", err);
        res.status(500).send("Ошибка сервера: " + err.message); 
    }
});

app.get('/api/my-orders', async (req, res) => {
    if (!req.session.userId) return res.status(401).send("Нет сессии");
    try {
        const [rows] = await db.query("SELECT * FROM orders WHERE id_user = ? ORDER BY created_at DESC", [req.session.userId]);
        res.json(rows);
    } catch (err) { res.status(500).send("Ошибка"); }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

app.listen(3000, () => console.log('Сервер запущен: http://localhost:3000'));