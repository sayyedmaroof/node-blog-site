const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))