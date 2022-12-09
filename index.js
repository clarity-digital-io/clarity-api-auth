const express = require('express')
const path = require('path')
const bodyParser = require('body-parser'); 
const PORT = process.env.PORT || 5000

const credentialsRouter = require('./credentials');
const authRouter = require('./auth');

let app = express();

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/index'));

app.use('/auth', authRouter);
app.use('/credentials', credentialsRouter);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

