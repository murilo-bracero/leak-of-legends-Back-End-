const request = require('request-promise');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const modelUser = mongoose.model('User');
const modelFriends = mongoose.model('Friends');


const search = async (user, country) => {
    const options = {
        uri: `https://${country}.op.gg/summoner/userName=${user}`,
        transform: body => cheerio.load(body)
    }

    return request(options)
            .then($ => {
                const Elo = $('.TierRank').text();
                return {
                    username: $('.Name').html(),
                    PerfilUri: $('.ProfileImage').attr('src').replace('//', ''),
                    Elo: Elo.includes('Unranked') ? 'Unranked' : Elo
                }
                
            })
            .catch(err => err);
}

const scrappingNews = async(page) => {
    const options = {
        uri: `https://dotesports.com/league-of-legends/page/${page}`,
        transform: body => cheerio.load(body)
    }
    var list = [];
    await request(options)
            .then($ => $('.list-blog').find('article').each((index, element) => {
                var news = {
                    image: $(element).find('.tw-thumbnail').attr('style').replace('background-image: url(', '').replace(');', ''),
                    title: $(element).find('.entry-title').text(),
                    link: $(element).find('.entry-title > a').attr('href')
                }
                list.push(news);
            }))
            .catch(err => err);

    return list;

}

const scrappingChamps = async() => {
    const options = {
        uri: 'https://leagueoflegends.fandom.com/wiki/List_of_champions',
        transform: body => cheerio.load(body)
    }
    var champList = [];
    await request(options)
            .then( $ => {
                $('table').find('tbody > tr').each( (index,element) => {
                    var champ = $(element).find('img').attr('alt');
                    if(champ !== null && champ !== undefined && champ !== "BE icon"){
                        champList.push(champ.replace('Square', '').replace('&#039;', "'"));
                    }
                } )
            } )
            .catch(err => err);
    return champList;
}

module.exports = {
    async getChamps(req, res){
        const champs = await scrappingChamps();
        res.json(champs);
    },

    async getNews(req, res){
        if(isNaN(req.params.page)) return res.status(400).json({"message":"invalid page number"});
        res.json(await scrappingNews(req.params.page = 0));
    },

    async save(req, res){
        const { username, country, password } = req.body;
        const result = await search(username, country);

        const {PerfilUri, Elo} = result;

        if(result.username == null) return res.status(404).json({"message": "User doesnt exist in LoL database"});

        try{
            const friendList = await modelFriends.create({});
            await modelUser.create({
                Username: username,
                Password: password,
                Country: country,
                PerfilUri,
                Elo,
                Friends: friendList
            }).catch( err => console.log(err));
        }catch(err){
            return res.status(400).json({"message":err});
        }
        return res.status(200).json({"message":"success"});
    },

    async getUserInfo(req, res){
        const user = await modelUser.findById(req.params.id);
        if(user == null) return res.status(404).json({"message":"user doesnt exists"});
        return res.status(200).json(user);
    },

    async findUser(req, res){
        const user = await modelUser.findOne({ 'username': req.params.username });
        if(user == null) return res.status(404).json({ "messsage":"user doesnt exists" });
        return res.status(200).json(user);
    },

    async addToFavs(req, res){
        const { favs, champName } = req.body;
        favs.push(champName);
        try{
            await modelUser.findByIdAndUpdate(req.userId, {favs}, {useFindAndModify: false});
            return res.status(200).json({ "message":"success", "favs":favs });
        }catch(err){
            return res.status(400).json({ "message":err.message });
        }
    },

    async removeToFavs(req, res){
        const { favs, champName } = req.body;
        
        const up = favs.filter(item => item !== champName);
        try{
            await modelUser.findByIdAndUpdate(req.userId, {favs: up}, {useFindAndModify: false});
            return res.status(200).json({ "message": "success", "favs": up });
        }catch(err){
            return res.status(400).json({ "message":err.message});
        }
    },

    async deleteUser(req, res){
        const { password, password_val } = req.body;

        const user = await modelUser.findById(req.userId).select('+password');
        const match = await bcrypt.compare(password, user.password);

        if(password !== password_val || !match) 
            return res.status(400).json({ "message":"Erro de comparação" });

        try{
            await modelUser.findByIdAndDelete(req.userId);
            return res.status(200).json({ "message":"success" });
        }catch(err){
            return res.status(400).json({ "message": err.message });
        }
    },

    async addFriend(req, res){
        try{
            const user = await modelUser.findById(req.body.id);
            console.log(user.Friends);
            await modelFriends.findByIdAndUpdate(user.Friends, {
                $addToSet: {requests: req.userId}
            }, {useFindAndModify: false});
            res.status(200).json({"message":"success"});
        }catch(err){
            res.status(400).json({"message":err.message});
        }
        
    }
    //TODO - mudar a senha
    
}