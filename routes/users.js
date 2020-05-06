const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router()

const User = require('../models/Users')

router.get('/logout', (req, res)=>{
    req.logOut()
    req.flash('successMessage', 'You have logged out')
    res.redirect('/users/login')
})

router.get('/login', (req, res)=>{
    res.render('login')
})

router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard', 
        failureRedirect: '/users/login', 
        failureFlash: true
    })(req, res, next)
})

router.get('/register', (req, res)=>{
    res.render('register')
})

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []

    // Basic Validation
    if(!name || !email || !password || !password2){
        errors.push({
            message: 'Please fill in all the fields'
        })
    }

    if(password !== password2){
        errors.push({
            message: 'Passwords do not match'
        })
    }

    if(password.length < 6){
        errors.push({
            message: 'Password should be at least 6 characters'
        })
    }

    // If any error encountered on validation
    if(errors.length > 0){
        res.render('register', {
            errors, 
            name,
            email,
            password, 
            password2
        })
    }else{
        // Passed validation
        User.findOne({email: email})
            .then(user =>{
                // Check If User Exists
                if(user){
                    errors.push({
                        message: 'Email already exists'
                    })
                    res.render('register', {
                        errors, 
                        name,
                        email,
                        password, 
                        password2
                    })
                }else{
                    const user = new User({
                        name, 
                        email, 
                        password
                    })

                    // Hashing Password
                    bcrypt.genSalt((err, salt) =>{
                        if(err) throw err
                        bcrypt.hash(user.password, salt, (err, hash)=>{
                            // Save to DB
                            if(err) throw err
                            user.password = hash
                            user.save()
                                .then(() =>{
                                    req.flash('successMessage', 'You are now registered and can login')
                                    res.redirect('login')
                                })
                                .catch(err => console.error(err))
                        })
                    })
                    
                }
            })
            .catch(err => console.error(err))

    }
})

module.exports = router