const path = require('path')
const express = require('express')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const connectFlash = require('connect-flash')
const MomentHandler = require("handlebars.moment")

require('./database/db/mongoose')

const User = require('./database/models/user')

const storePost = require('./middleware/storePost')
const auth = require('./middleware/auth')
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')

const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require('./controllers/createUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')
const profilePageController = require('./controllers/profilePage')

const app = new express()
const port = process.env.PORT

app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: connectMongo.create({
        mongoUrl: process.env.MONGODB_URL
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));

const viewsPath = path.join(__dirname, "templates/views");
const partialsPath = path.join(__dirname, "templates/partials")

app.use(fileUpload())
app.use(express.static('public'))
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
MomentHandler.registerHelpers(hbs);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(connectFlash())

app.use('/posts/store', storePost)

// assingning global variables to all posts
app.use(async (req, res, next) => {
    res.locals.isAuthenticated = req.session.userId
    if (res.locals.isAuthenticated) {
        const user = await User.findById(req.session.userId)
        res.locals.currentUser = user.username
        res.locals.currentUserId = user._id
    }
    next()
})

app.get('/', homePageController)
app.get('/post/:id', getPostController)
app.get('/posts/new', auth, createPostController)
app.post('/posts/store', auth, storePost, storePostController)
app.get('/auth/login', redirectIfAuthenticated, loginController)
app.post('/users/login', redirectIfAuthenticated, loginUserController)
app.get('/auth/register', redirectIfAuthenticated, createUserController)
app.post('/users/register', redirectIfAuthenticated, storeUserController)
app.get('/auth/logout', auth, logoutController)
app.get('/users/:id', auth, profilePageController)
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})