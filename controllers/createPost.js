const User = require('../database/models/user')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    return res.render('create', { user })
}