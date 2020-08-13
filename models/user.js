const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const salt = 10

const userScheme = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, 'can not be blank']    
    },
    last_name: {
        type: String,
        required: [true, 'can not be blank']   
    },
    surname: {
        type: String,
        required: [true, 'can not be blank']   
    },
    phone: {
        type: String,
        match: [/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'is invalid'],
    },
    address:{
        region: String,
        city: String,
        street: String,
        house: String,
        apartment: Number,
        zip: Number,
        
    },
    email:{
        type: String,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        unique: true,
        required: [true, 'can not be blank']
    },
    birthday: Date,
    password: {
        type: String,
        minlength: 8,
        required: [true, 'can not be blank']
    } ,
    date: Date,
    purchased: String,
    
    status: {
        type: String,
        required: [true, 'can not be blank'],
        default: 'User'
    },

});



userScheme.pre('save', function(next) {
    var user = this;

    // хешируем пароль,если он был изменен или он новый
    if (!user.isModified('password')) return next();

    // соль
    bcrypt.genSalt(salt, function(err, salt) {
        if (err) return next(err);

        // хэшируем пароль, используя новую соль
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // переопределяем пароль на хэшированный
            user.password = hash;
            next();
        });
    });
});


var User = mongoose.model('User', userScheme);

module.exports = User;
