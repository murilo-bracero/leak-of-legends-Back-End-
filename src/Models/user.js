const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        maxlength: 16,
        minlength: 3
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    favs:{
        type: Array,
    }
});

UserSchema.plugin(mongoosePaginate);
UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, bcrypt.genSaltSync(10));
    this.password = hash;

    next();
});
mongoose.model('User', UserSchema);