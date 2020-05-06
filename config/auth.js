module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()) return next()

        req.flash('errorMessage', 'You have to login to view this page')
        res.redirect('/users/login')
    }
}