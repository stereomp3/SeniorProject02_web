const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const session = require("express-session");
const flash = require('express-flash');
const app = express();
const User = require('./modules/User')
const userData = require('./modules/userData')
const ai_inqury = require('./modules/AIinqury')
const MongoDBSession = require('connect-mongodb-session')(session)
// const MONGODB_URI = 'mongodb+srv://project_admin:a123456789@project1.8ishzzb.mongodb.net/?retryWrites=true&w=majority'
// const MONGODB_URI = 'mongodb://172.104.91.57:27017/?directConnection=true&serverSelectionTimeoutMS=10000&appName=mongosh+1'
// const MONGODB_URI = 'mongodb://172.104.91.57:27017/test'
const MONGODB_URI = 'mongodb://110910541:110910541@172.104.91.57:27017/test'
// const MONGODB_URI = 'mongodb://localhost:27017/connect_mongodb_session_test'
const path = require("path");
const { Server } = require("http");
const { use } = require("passport");
const { MongoDBStore } = require("connect-mongodb-session");
const { emitWarning } = require("process");
const publicPath = path.join(__dirname, 'public')
const { MongoClient, ObjectID } = require('mongodb').MongoClient;
const { json } = require("body-parser");
const store = new MongoDBSession({
    uri: MONGODB_URI,
    collection: "mySessions"
})
const isAuth = (req, res, next) => {
    if (req.session.isAuth) { next() }
    else {

        res.redirect('loggin3/loggin3.html')
    }
}
const isLogging = (req, res, next) => {
    if (req.session.isAuth) {
        res.sendFile(`${publicPath}/loggin_sucess_main.html`)
    }
    else { next() }
}

// debug
async function showUserLog() {
    var nnnn = await User.find({})
    // var nnnn = await ai_inqury.find({})
    console.log(nnnn)
}

showUserLog()


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "key that will sign cookie",
    resave: false,
    saveUninitialized: false,
    store: store
}))
//when use back button web will reload and can't cache
app.use(function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next()
})
app.set('view engine', 'ejs'); // 設定模板引擎為 EJS


async function connectToDatabase() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongoose connected");
    } catch (error) {
        console.log("Mongoose error:", error);
    }
}
connectToDatabase();


const db = mongoose.connection;
db.on('error', () => console.log("Mongoose error"));
db.once('open', () => console.log("Mongoose connected"));


app.get("/", isLogging, async (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.sendFile(`${publicPath}/main.html`)
}).listen(3000);


app.get("/loggin", isLogging, (req, res) => {
    res.sendFile(`${publicPath}/loggin3.html`)
})

app.post("/loggin", async (req, res) => {
    const password = req.body.password
    const email = req.body.email
    const user = await User.findOne({ "username": email })  // user name
    console.log(user)
    if (!user) {
        return res.sendFile(`${publicPath}/register.html`)
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch && password != user.password) {
        console.log(`User: ${email}'s accout is tried to login`);
        return res.sendFile(`${publicPath}/loggin3.html`)
    }
    req.session.isAuth = true
    console.log(`User: ${email} login sucessfully `);
    return res.sendFile(`${publicPath}/loggin_sucess_main.html`)
});



app.post("/loggin_page", (req, res) => {
    res.sendFile(`${publicPath}/loggin3.html`)
})







app.get("/home", (req, res) => {
    res.sendFile(`${publicPath}/main.html`)
})

app.post("/home", (req, res) => {
    res.sendFile(`${publicPath}/main.html`)
})





app.get('/sign_up', (req, res) => {
    res.sendFile(`${publicPath}/register.html`)
})

app.post("/sign_up", async (req, res) => {
    const username = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    let user = await User.findOne({ email })
    if (user) {
        return res.sendFile(`${publicPath}/register.html`)
    }
    const hashedPsw = await bcrypt.hash(password, 12)
    user = new User({
        username,
        email,
        password: hashedPsw,
        phone
    })

    await user.save()
    res.sendFile(`${publicPath}/loggin3.html`)
});





app.get('/loggin_sucess', isAuth, (req, res) => {
    res.sendFile(`${publicPath}/main.html`)
})
app.post('/loggin_sucess', isAuth, (req, res) => {
    res.sendFile(`${publicPath}/main.html`)
})


app.get('/register', (req, res) => {
    res.sendFile(`${publicPath}/register.html`)
})

app.post('/register', (req, res) => {
    res.sendFile(`${publicPath}/register.html`)
})


app.get("/loggout", isLogging, (req, res) => {
    res.sendFile(`${publicPath}/main.html`)
})

app.post("/loggout", (req, res) => {

    req.session.destroy((err) => {
        if (err) throw err
        res.sendFile(`${publicPath}/main.html`)
    })
})

// .then(
//     (result) => {result.map(item => `<tr><td>${item.username}</td><td>${item.email}</td>
//     <td>${item.message}</td><td></td></tr>`).join('')})
async function get_user_info(req, res) {
    var content = await User.find({})
    var ts = content.map(item => `<tr><td>${item.username}</td><td>${item.email}</td><td>${item.phone}</td><td></td></tr>`).join('')
    res.send({ "user_info": ts })
}
async function get_user_info(req, res) {  // use in personal
    var content = await User.find({})
    var ts = content.map(item => `<tr><td>${item.username}</td><td>${item.email}</td><td>${item.phone}</td><td></td></tr>`).join('')
    res.send({ "user_info": ts })
}
app.post("/get_user_info", get_user_info)

async function get_ai_inqury_info(req, res) {  // use in suggestion
    var content = await ai_inqury.find({})
    console.log(content)
    var ts = content.map(item => `<tr><td>${item.username}</td><td>${item.message}</td><td>${item.symptom}</td><td>${item.date}</td><td></td></tr>`).join('')
    res.send({ "user_info": ts })
}
app.post("/get_ai_inqury_info", get_ai_inqury_info)

async function get_certain_user_info(req, res) {  // use in table search (suggestion)
    var username = req.body.value
    var content = await ai_inqury.find({})
    var ts = ``
    for (i = 0; i < content.length; i++) {
        item = content[i]
        if (item.username.includes(username)) {
            ts += `<tr><td>${item.username}</td><td>${item.message}</td><td>${item.symptom}</td><td>${item.date}</td><td></td></tr>`
        }
    }
    // var ts = content.map(item => `<tr><td>${item.username}</td><td>${item.message}</td><td>${item.symptom}</td><td>${item.date}</td><td></td></tr>`).join('')
    res.send({ "user_info": ts })
}
app.post("/get_certain_user_info", get_certain_user_info)


async function get_symptom_info(req, res) {  // use in chart
    var symptom = req.body.value
    var content = []
    if (symptom == "all") content = await ai_inqury.find({})
    else content = await ai_inqury.find({ 'symptom': symptom })
    ts = []
    for (i = 0; i < content.length; i++) {
        item = content[i]
        ts.push([item.date, item.symptom])
    }
    res.send({ "user_info": ts })

}
app.post("/get_chart_ai_query_info", get_symptom_info)

app.get("/personal", isAuth, (req, res) => {
    res.sendFile(`${publicPath}/personal.html`)
})

app.get("/suggestion", isAuth, (req, res) => {
    res.sendFile(`${publicPath}/suggestion.html`)
})

app.get("/loggin_sucess_main", isAuth, async (req, res) => {
    res.sendFile(`${publicPath}/loggin_sucess_main.html`)
})

