const mongoose = require('mongoose');

const FriendsSchema = new mongoose.Schema({
    friend_list:{
        type:Array,
    },
    requests:{
        type:Array
    }
});

mongoose.model('Friends', FriendsSchema);