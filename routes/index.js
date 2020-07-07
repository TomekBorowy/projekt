const express = require('express');
const Advertisment = require('../models/Advertisment');
const router = express.Router();

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

const {
    ensureAuthenticated,
    ensureAuthenticated2,
    forwardAuthenticated
} = require('../config/auth');


// Welcome Page forwardAuthenticated,
router.get('/', ensureAuthenticated2, (req, res) => {
    const search = req.query.search || '';
    const advert = Advertisment
        .find({
            title: new RegExp(search.trim(), 'i')
        })
        .sort({
            created: -1
        });
    advert.exec((err, data) => {
        res.render('welcome', {

            data,
            search,


        });
    })

});
router.get('/main', (req, res) => {
    const search = req.query.search || '';
    const advert = Advertisment
        .find({
            title: new RegExp(search.trim(), 'i')
        })
        .sort({
            created: -1
        });
    advert.exec((err, data) => {
        res.render('main', {
            user: req.user,
            data,
            search,


        });
    })

});
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    var query = {
        userid: req.user._id
    };

    Advertisment.find(query, (err, data) => {
        res.render('dashboard', {
            user: req.user,
            data,
            image: req.body.image
        });
    });

});


router.get('/adv/add', (req, res) => {
    if (req.user == null) {
        res.redirect('/users/login');
        return;
    };
    res.render('adv-form', {
        title: 'Dodaj ogłoszenie',
        user: req.user,
        body: {},
        errors: {}
    });

});

router.post('/adv/add', (req, res) => {
    const body = req.body;

    const advData = new Advertisment(body);
    const errors = advData.validateSync();
    // console.log(req.body);
    // if (req.body.image !== "") {
    //     saveImage(advData, req.body.image);
    // }

    saveImage(advData, req.body.image);
    advData.save((err) => {
        if (err) {
            res.render('adv-form', {
                title: 'Dodaj ogłoszenie',
                errors,
                body,
                user: req.user,
            });
            return;
        }

        res.redirect('/dashboard')
    });

});
router.get('/adv/edit/:id', (req, res) => {
    var query1 =
        req.params.id;
    const advData = Advertisment.findById(query1);

    advData.exec((err, data) => {

        res.render('adv-edit', {
            title: 'Edytuj ogłoszenie',
            user: req.user,
            data,

        });

    });

});
router.post('/adv/edit/:id', (req, res) => {
    // const body = req.body;

    //const advData = new Advertisment(body);

    const {
        title,
        description,
        user,
        category,
        telNumber,
        email,
        place,
        province,
        price,




    } = req.body;
    // if (req.body.image == "") {
    //     res.redirect('/adv/edit/:id');
    //     return;
    // };
    // if (req.body.image == "") {
    //     const image = JSON.parse(req.body.image)
    //     new Buffer.from(image.data, 'base64')
    // }


    // const image = JSON.parse(req.body.image)
    Advertisment.findByIdAndUpdate({
            _id: req.params.id
        }, {
            title: req.body.title,
            description: req.body.description,
            user: req.body.user,
            category: req.body.category,
            telNumber: req.body.telNumber,
            email: req.body.email,
            place: req.body.place,
            province: req.body.province,
            price: req.body.price,

            // image: new Buffer.from(image.data, 'base64')

        }, {
            new: true
        },
        function (err, result) {
            if (err) {
                console.log(err);
            } else {

                res.redirect('/dashboard')
            }
        }
    );






});

router.get('/adv/delete/:id', (req, res) => {
    Advertisment.findByIdAndDelete(req.params.id, (err) => {
        res.redirect('/dashboard')
    })
});

function saveImage(advData, imageEncoded) {
    if (imageEncoded == "") return;
    const image = JSON.parse(imageEncoded)
    if (image != null && imageMimeTypes.includes(image.type)) {
        advData.image = new Buffer.from(image.data, 'base64')
        advData.imageType = image.type
    }
}

module.exports = router;