const User = require('../database/models/user')
const Post = require('../database/models/post')

module.exports = async (req, res) => {
    const user = await User.findById(req.params.id)
    const posts = await Post.find({ owner: user._id })
    res.render('profile', { user, posts })
}