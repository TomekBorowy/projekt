module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/users/login');
    },
    ensureAuthenticated2: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }

        res.redirect('/main');
    },
    forwardAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/dashboard');
    }
};