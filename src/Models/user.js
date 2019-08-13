const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    Username:{
        type: String,
        required: true,
        unique: true,
        maxlength: 16,
        minlength: 3
    },
    Password:{
        type: String,
        required: true,
        select: false
    },
    Favs:{
        type: Array,
    },
    PerfilUri:{
        type: String,
        required: true
    },
    Country:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 2
    },
    Elo:{
        type: String,
        required: true,
    },
    Friends:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friends'
    }
});

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.Password, bcrypt.genSaltSync(10));
    this.Password = hash;

    next();
});
mongoose.model('User', UserSchema);