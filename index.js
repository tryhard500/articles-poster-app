let express = require(`express`);
let app = express();
let port = 3005;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})

let cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));

// Настройка POST-запроса — JSON
app.use(express.json());


// Настройка БД
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/events-app');

// Схемы
let schema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    ticketsCount: Number,

    // Добавить дату
    date: Date
});

let Event = mongoose.model('events', schema);

app.get('/events/all', async function (req, res) {
    let events = await Event.find({}).sort({date: 1});
    res.send(events);
});

app.get('/events/next', async function (req, res) {
    let from = req.query.from;

    let events = await Event.find({date: {$gte: from}});
    res.send(events);
});


app.get('/events/search', async function (req, res) {
    let from = req.query.from;
    let to = req.query.to;

    let events = await Event.find({date: {$gte: from, $lte: to}});
    res.send(events);
});

app.post('/events/register', async function (req, res) {
    let id = req.body.id;
    console.log(id);
    let event = await Event.findOne({_id: id});
    if (event.ticketsCount > 0) {
        event.ticketsCount--;
    }

    await event.save();

    res.send(event);
}) 