const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB'ye bağlanma işlemi
mongoose.connect('mongodb://localhost/todo-app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

// MongoDB modeli oluşturma
const todoSchema = new mongoose.Schema({
    todo: String,
    isDone: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json({ todos }); // Bulunan todos verilerini JSON olarak döndür
    } catch (err) {
        console.error(err);
        res.status(500).send('Bir hata oluştu');
    }
});

app.post('/', async (req, res) => {
    try {
        // İstekten gönderilen verileri alın
        const { todo, isDone } = req.body;

        // Yeni bir Todo nesnesi oluşturun
        const newTodo = new Todo({
            todo: todo,
            isDone: isDone
        });

        // Yeni todo'yu veritabanına kaydedin
        const savedTodo = await newTodo.save();

        // Başarılı bir şekilde kaydedildiğine dair bir mesaj gönderin
        res.status(201).json(savedTodo); // Kaydedilen todo'nun JSON formatında yanıt olarak dönülmesi

    } catch (error) {
        console.error(error);
        res.status(500).send('Gönderme işlemi başarısız');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
