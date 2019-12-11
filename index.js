const Telegraf = require('telegraf')
const helper = require('./helper')
const express = require('express')
const app = express()
const bot = new Telegraf(helper.getToken())

const Extra = require('telegraf/extra')
const Session = require('telegraf/session')
const Stage = require('telegraf/stage')
const kb = require('./keyboard')
const mongoose = require('mongoose')
const keyboard = require('./keyboard-buttons')

const WizardScene = require('telegraf/scenes/wizard')
let id = 0

mongoose.Promise = global.Promise
mongoose.connect('mongodb://Shark:ruslan2002@ds161751.mlab.com:61751/mydb',{
    useNewUrlParser:true
})
    .then(() => console.log('Connected'))
    .catch(e => console.log(e))
require('./user.model')
require('./order.model')
require('./feed.model')
const Feed = mongoose.model('feed')
const User = mongoose.model('user')
const Order = mongoose.model('order')
app.use(bot.webhookCallback('/bot'));
bot.telegram.setWebhook('https://telegraftelegrambot.herokuapp.com/bot');

bot.hears(/\/start/,(ctx) => {
    const telegramID = ctx.message.hasOwnProperty('chat') ? ctx.message.chat.id : ctx.message.from.id
    const user = new User({
        id:telegramID,
        isAdmin:false,
        username:ctx.update.message.from.username
    })
    const isNew = helper.isNewUser(telegramID).then(p =>{
        if(p){
           
            user.save().then(() =>{
                return ctx.reply(`Добро пожаловать в наш бот!`,Extra.markup((markup) =>{
                    return markup.resize()
                        .keyboard(kb.main_menu)
                }))

            }).catch(err => ctr.reply('Что то не то'));
        }
        if(!p){
            
            User.find({id:telegramID,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    console.log('here');
                    return ctx.reply(`Добро пожаловать в наш бот!`, Extra.markup((markup) => {
                        return markup.resize()
                        .keyboard(kb.main_menuSecret)
                    })).catch(err => ctr.reply('Что то не то'));
                }else{
                    console.log('there');
                    return ctx.reply(`Добро пожаловать в наш бот!`,Extra.markup((markup) =>{
                        return markup.resize()
                                 .keyboard(kb.main_menu)
                    })).catch(err => ctr.reply('Что то не то'));
                }
            })

        }
       
    }).catch(error => ctx.reply(`Что-то пошло не так\n${error}`))
})

const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
