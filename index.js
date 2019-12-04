const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')
const express = require('express')
const app = express()

const Session = require('telegraf/session')
const Stage = require('telegraf/stage')
const kb = require('./keyboard')
const mongoose = require('mongoose')
const keyboard = require('./keyboard-buttons')
const helper = require('./helper')
const WizardScene = require('telegraf/scenes/wizard')

let id = 0
const bot = new Telegraf(helper.getToken())
app.use(bot.webhookCallback('/bot'))
bot.telegram.setWebhook('https://telegraftelegrambot.herokuapp.com/bot')
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
const panelScene = new WizardScene('adminScene',
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
            User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
        switch (ctx.update.message.text) {
            case keyboard.adminPanelPage.sendToAll:
                ctx.reply('Введите сообщение:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard([keyboard.back])
                }))
                ctx.scene.session.state = {
                    sendAll:'sendAll'
                }
                ctx.wizard.next()
                break
            case keyboard.adminPanelPage.shares:
                ctx.reply('Выберите функцию:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.sharesPage)
                }))
                ctx.scene.leave()
                ctx.scene.enter('createShares')
                break
            case keyboard.adminPanelPage.admins:
                User.find({isAdmin:true}).then((u) =>{
                    let id = u.map((id) =>{
                        return `${id.id}`
                    })
                    let username = u.map((user) =>{
                        return `${user.username}`
                    })
                    let ids = ''
                    for(let i = 0; i < id.length; i++){
                        ids += id[i]+' - '+ username[i] +'\n';
                    }
                    ctx.reply('Администарторы:\n'+ids)
                })
                break
            case keyboard.adminPanelPage.deleteUser:
                ctx.scene.session.state = {
                    deleteUser:'deleteUser'
                }
                ctx.reply('Введите телеграм ID администратора:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard([keyboard.back])
                }))
                ctx.wizard.next()
                break
            case keyboard.adminPanelPage.addUser:
                ctx.scene.session.state = {
                    addUser:'addUser'
                }
                ctx.reply('Введите телеграм ID пользователя:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard([keyboard.back])
                }))
                ctx.wizard.next()

                break
            case keyboard.back:
                User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                    if(u.length !== 0){
                        ctx.scene.leave()
                        ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                            markup.resize()
                            return markup.keyboard(kb.main_menuSecret)
                        }))
                    }else{
                        ctx.scene.leave()
                        ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                            markup.resize()
                            return markup.keyboard(kb.main_menu)
                        }))
                    }
                })
                break
        }
    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
            User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
        let addUser = ctx.scene.session.state.addUser || ''
        let deleteUser = ctx.scene.session.state.deleteUser || ''
        let sendAll = ctx.scene.session.state.sendAll || ''
        if(addUser !== ''){
            if(ctx.update.message.text !== keyboard.back){
                let id = parseInt(ctx.update.message.text);
                ctx.scene.session.state = {
                    id:id
                }
                ctx.reply('Введите имя администартора:')
                ctx.wizard.next()
            }else{
                ctx.reply('Выберите функцию:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.adminFunc)
                }))
                ctx.wizard.back()
            }

        }
        if(deleteUser !== ''){
            let id = ctx.update.message.text
            if(ctx.update.message.text !== keyboard.back) {
                User.find({id: id, isAdmin: true}).then((u) => {
                    if (u.length !== 0) {
                        User.findOneAndDelete({id: id, isAdmin: true}).then(() => {
                            ctx.reply('Успешно удалено!', Extra.markup((m) => {
                                m.resize()
                                return m.keyboard(kb.adminFunc)
                            }))
                        })
                        ctx.wizard.back()
                    }
                    else {
                        ctx.reply('Данный пользователь не является админом!')
                    }
                })
            }else{
                ctx.reply('Выберите функцию:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.adminFunc)
                }))
                ctx.wizard.back()
            }
        }
        if(sendAll !== ''){
            if(ctx.update.message.text !== keyboard.back){
                const message = ctx.update.message
                ctx.scene.session.state = {
                    message:message
                }
                ctx.reply('Это конечное сообщение?',Extra.markup((m) =>{
                    m.resize()
                    m.oneTime()
                    return m.keyboard([
                        ['Да','Нет'],
                        [keyboard.back]
                    ])
                }))
                ctx.wizard.next()
            }else{
                ctx.reply('Выберите функцию:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.adminFunc)
                }))
                ctx.wizard.back()
            }

        }
    },
    (ctx) =>{
        const message = ctx.scene.session.state.message || ''
        if (ctx.update.message.text === '/start') {
            User.find({id: ctx.update.message.from.id, isAdmin: true}).then((u) => {
                if (u.length !== 0) {
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                } else {
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
        if (message === '') {
        let name = ctx.update.message.text
        let id = ctx.scene.session.state.id
        if (ctx.update.message.text !== keyboard.back && ctx.update.message.text !== '/start') {
            User.find({id: id}).then(u => {
                if (u.length !== 0) {
                    User.findOneAndDelete({id: id}).then(() => {
                        let admin = new User({
                            id: id,
                            isAdmin: true,
                            username: name
                        })
                        admin.save().then(() => {
                            ctx.reply('Успешно добавлен!', Extra.markup((m) => {
                                m.resize()
                                return m.keyboard(kb.adminFunc)
                            }))
                            ctx.wizard.back()
                            ctx.wizard.back()
                        })
                    })
                } else {
                    let admin = new User({
                        id: id,
                        isAdmin: true,
                        username: name
                    })
                    admin.save().then(() => {
                        ctx.reply('Успешно добавлен!', Extra.markup((m) => {
                            m.resize()
                            return m.keyboard(kb.adminFunc)
                        }))
                        ctx.wizard.back()
                        ctx.wizard.back()
                    })
                }
            })
        } if(ctx.update.message.text === keyboard.back) {
            ctx.reply('Введите телеграм ID пользователя:', Extra.markup((m) => {
                m.resize()
                return m.keyboard([keyboard.back])
            }))
                ctx.scene.session.state = {
                    addUser:'addUser'
                }
            ctx.wizard.back()
        }
    }else
        {
            if(ctx.update.message.text === keyboard.back){
                ctx.reply('Введите сообщение:', Extra.markup((m) => {
                    m.resize()
                    return m.keyboard([keyboard.back])
                }))
                ctx.scene.session.state = {
                    sendAll:'sendAll'
                }
                ctx.wizard.back()
            }else {
                if (ctx.update.message.text === 'Да') {
                    const message = ctx.scene.session.state.message
                    if (message.hasOwnProperty('photo')) {
                        bot.telegram.getFileLink(message.photo[message.photo.length - 1].file_id).then((f) => {
                            User.find({}).then((id) => {
                                const users_id = id.map((i) => {
                                    return i.id
                                })
                                if (message.hasOwnProperty('caption')) {
                                    for (let i = 0; i < users_id.length; i++) {
                                        bot.telegram.sendPhoto(users_id[i], {url: f}, {
                                            caption: message.caption
                                        })
                                    }
                                } else {
                                    for (let i = 0; i < users_id.length; i++) {
                                        bot.telegram.sendPhoto(users_id[i], {url: f})
                                    }
                                }
                                ctx.reply('Сообщение успешно отправлено!', Extra.markup((m) => {
                                    m.resize
                                    return m.keyboard(kb.adminFunc)
                                }))
                                ctx.wizard.back()
                                ctx.wizard.back()
                            })
                        })
                    }
                    else if (message.hasOwnProperty('voice')) {
                        bot.telegram.getFileLink(message.voice.file_id).then((f) => {

                            User.find({}).then((id) => {
                                const users_id = id.map((i) => {
                                    return i.id
                                })
                                for (let i = 0; i < users_id.length; i++) {
                                    bot.telegram.sendVoice(users_id[i], {url: f})
                                }
                                ctx.reply('Сообщение успешно отправлено!', Extra.markup((m) => {
                                    m.resize
                                    return m.keyboard(kb.adminFunc)
                                }))
                                ctx.wizard.back()
                                ctx.wizard.back()
                            })
                        })
                    } else if(message.hasOwnProperty('video')){
                            bot.telegram.getFileLink(message.video.file_id).then((f) =>{
                                User.find({}).then((id) => {
                                    const users_id = id.map((i) => {
                                        return i.id
                                    })
                                    for (let i = 0; i < users_id.length; i++) {
                                        bot.telegram.sendVideo(users_id[i], {url: f})
                                    }
                                    ctx.reply('Сообщение успешно отправлено!', Extra.markup((m) => {
                                        m.resize
                                        return m.keyboard(kb.adminFunc)
                                    }))
                                    ctx.wizard.back()
                                    ctx.wizard.back()
                                })
                            })
                    }
                    else {
                        User.find({}).then((id) => {
                            const users_id = id.map((i) => {
                                return i.id
                            })
                            for (let i = 0; i < users_id.length; i++) {
                                bot.telegram.sendMessage(users_id[i], message.text)
                            }
                            ctx.reply('Сообщение успешно отправлено!', Extra.markup((m) => {
                                m.resize
                                return m.keyboard(kb.adminFunc)
                            }))
                            ctx.wizard.back()
                            ctx.wizard.back()
                        })
                    }
                }
                if (ctx.update.message.text === 'Нет') {
                    const message = ctx.scene.session.state.message
                    if (message.hasOwnProperty('photo')) {
                        if (message.hasOwnProperty('caption')) {
                            ctx.scene.session.state = {
                                message: message,
                                hasPhoto: {
                                    photo: true,
                                    caption: true
                                },
                                hasVoice: false,
                                hasVideo:false,
                                hasText: false
                            }
                        } else {
                            ctx.scene.session.state = {
                                message: message,
                                hasPhoto: {
                                    photo: true,
                                    caption: false
                                },
                                hasVoice: false,
                                hasVideo:false,
                                hasText: false
                            }
                        }

                    }
                    else if (message.hasOwnProperty('voice')) {
                        ctx.scene.session.state = {
                            message: message,
                            hasPhoto: {
                                photo: false,
                                caption: false
                            },
                            hasVoice: true,
                            hasVideo:false,
                            hasText: false
                        }
                    }else if(message.hasOwnProperty('video')){
                        ctx.scene.session.state = {
                            message: message,
                            hasPhoto: {
                                photo: false,
                                caption: false
                            },
                            hasVoice: false,
                            hasVideo:true,
                            hasText: false
                        }
                    }
                    else {
                        ctx.scene.session.state = {
                            message: message,
                            hasPhoto: {
                                photo: false,
                                caption: false
                            },
                            hasVoice: false,
                            hasVideo:false,
                            hasText: true
                        }
                    }

                    ctx.reply('Введите сообщение', Extra.markup((m) => {
                        m.resize()
                        return m.keyboard()
                    }))
                    ctx.wizard.next()
                }
            }
        }

    },
    (ctx) =>{
        const first_message = ctx.scene.session.state.message
        const hasPhoto = ctx.scene.session.state.hasPhoto.photo
        const hasCaption = ctx.scene.session.state.hasPhoto.caption
        const hasVoice = ctx.scene.session.state.hasVoice
        const hasText = ctx.scene.session.state.hasText
        const hasVideo = ctx.scene.session.state.hasVideo

        let second_message = ctx.update.message
        let hasPhoto_2 = second_message.hasOwnProperty('photo')
        let hasCaption_2 = second_message.hasOwnProperty('caption')
        let hasVoice_2 = second_message.hasOwnProperty('voice')
        let hasText_2 = second_message.hasOwnProperty('text')
        let hasVideo_2 = second_message.hasOwnProperty('video')
        if(hasText){
            if(hasText_2){
                User.find({}).then((id) => {
                    const users_id = id.map((i) => {
                        return i.id
                    })
                    for (let i = 0; i < users_id.length; i++) {
                        bot.telegram.sendMessage(users_id[i],first_message.text).then(() =>{
                            bot.telegram.sendMessage(users_id[i],second_message.text)
                        });

                    }
                    ctx.scene.leave()
                })
            }
            else if(hasPhoto_2){
                bot.telegram.getFileLink(second_message.photo[second_message.photo.length-1].file_id).then((f) => {
                    User.find({}).then((id) => {
                        const users_id = id.map((i) => {
                            return i.id
                        })
                        if(hasCaption_2){
                            for (let i = 0; i < users_id.length; i++) {
                                bot.telegram.sendPhoto(users_id[i], {url: f}, {
                                    caption: second_message.caption
                                }).then(() =>{
                                    bot.telegram.sendMessage(users_id[i], first_message.text)
                                })
                            }
                        }
                        else{
                            for (let i = 0; i < users_id.length; i++) {
                                bot.telegram.sendPhoto(users_id[i], {url: f}).then(() =>{
                                    bot.telegram.sendMessage(users_id[i],first_message.text)
                                })
                            }
                        }
                        ctx.reply('Сообщение успешно отправлено!',Extra.markup((m) =>{
                            m.resize
                            return m.keyboard(kb.adminFunc)
                        }))
                        ctx.wizard.back()
                        ctx.wizard.back()
                        ctx.wizard.back()
                    })
                })

            }
            else if(hasVoice_2){
                bot.telegram.getFileLink(second_message.voice.file_id).then((f) => {

                    User.find({}).then((id) => {
                        const users_id = id.map((i) => {
                            return i.id
                        })
                        for (let i = 0; i < users_id.length; i++) {
                            bot.telegram.sendMessage(users_id[i],first_message.text)
                            bot.telegram.sendVoice(users_id[i], {url: f})
                        }
                        ctx.reply('Сообщение успешно отправлено!',Extra.markup((m) =>{
                            m.resize
                            return m.keyboard(kb.adminFunc)
                        }))
                        ctx.wizard.back()
                        ctx.wizard.back()
                        ctx.wizard.back()
                    })
                })
            }
            else if(hasVideo_2){
                bot.telegram.getFileLink(second_message.video.file_id).then((f) =>{
                    User.find({}).then((id) => {
                        const users_id = id.map((i) => {
                            return i.id
                        })
                        for (let i = 0; i < users_id.length; i++) {
                            bot.telegram.sendVideo(users_id[i], {url: f}).then(() =>{
                                bot.telegram.sendMessage(users_id[i],first_message)
                            })
                        }
                        ctx.reply('Сообщение успешно отправлено!', Extra.markup((m) => {
                            m.resize
                            return m.keyboard(kb.adminFunc)
                        }))
                        ctx.wizard.back()
                        ctx.wizard.back()
                    })
                })
            }

        }
        else if(hasPhoto){
            if(hasCaption){
                if(hasText_2){
                    bot.telegram.getFileLink(first_message.photo[first_message.photo.length-1].file_id).then((f) => {
                        User.find({}).then((id) => {
                            const users_id = id.map((i) => {
                                return i.id
                            })
                            for (let i = 0; i < users_id.length; i++) {
                                bot.telegram.sendPhoto(users_id[i], {url: f}, {
                                    caption: first_message.caption
                                }).then(() =>{
                                    bot.telegram.sendMessage(users_id[i], second_message.text)
                                })

                            }
                            ctx.scene.leave()
                        })
                    })
                }
                if(hasVoice_2){
                    bot.telegram.getFileLink(first_message.photo[first_message.photo.length-1].file_id).then((ff) => {
                        bot.telegram.getFileLink(second_message.voice.file_id).then((f) => {

                            User.find({}).then((id) => {
                                const users_id = id.map((i) => {
                                    return i.id
                                })
                                for (let i = 0; i < users_id.length; i++) {
                                    bot.telegram.sendPhoto(users_id[i], {url: ff},{
                                        caption:first_message.caption
                                    }).then(() =>{
                                        bot.telegram.sendVoice(users_id[i], {url: f})
                                    })

                                }
                                ctx.reply('Сообщение успешно отправлено!', Extra.markup((m) => {
                                    m.resize
                                    return m.keyboard(kb.adminFunc)
                                }))
                                ctx.wizard.back()
                                ctx.wizard.back()
                                ctx.wizard.back()
                            })
                        })
                    })
                }
            }else{
                if(hasText_2){
                    bot.telegram.getFileLink(first_message.photo[first_message.photo.length-1].file_id).then((f) => {
                        User.find({}).then((id) => {
                            const users_id = id.map((i) => {
                                return i.id
                            })
                            for (let i = 0; i < users_id.length; i++) {
                                bot.telegram.sendPhoto(users_id[i], {url: f}).then(() =>{
                                    bot.telegram.sendMessage(users_id[i], second_message.text)
                                })
                            }
                            ctx.scene.leave()
                        })
                    })
                }
                if(hasVoice_2){
                    bot.telegram.getFileLink(first_message.photo[first_message.photo.length-1].file_id).then((ff) => {
                        bot.telegram.getFileLink(second_message.voice.file_id).then((f) => {

                            User.find({}).then((id) => {
                                const users_id = id.map((i) => {
                                    return i.id
                                })
                                for (let i = 0; i < users_id.length; i++) {
                                    bot.telegram.sendPhoto(users_id[i], {url: ff}).then(() =>{
                                        bot.telegram.sendVoice(users_id[i], {url: f})
                                    })

                                }
                                ctx.reply('Сообщение успешно отправлено!', Extra.markup((m) => {
                                    m.resize
                                    return m.keyboard(kb.adminFunc)
                                }))
                                ctx.wizard.back()
                                ctx.wizard.back()
                                ctx.wizard.back()
                            })
                        })
                    })
                }
            }


        }
        else if (hasVoice){
            if(hasText_2){
                bot.telegram.getFileLink(first_message.voice.file_id).then((f) => {
                    User.find({}).then((id) => {
                        const users_id = id.map((i) => {
                            return i.id
                        })
                        for (let i = 0; i < users_id.length; i++) {
                            bot.telegram.sendVoice(users_id[i], {url: f}).then(() =>{
                                bot.telegram.sendMessage(users_id[i], second_message.text)
                            })
                        }
                        ctx.scene.leave()
                    })
                })
            }
            else if(hasPhoto_2){
                if(hasCaption_2){
                    bot.telegram.getFileLink(second_message.photo[second_message.photo.length-1].file_id).then((ff) => {
                        bot.telegram.getFileLink(first_message.voice.file_id).then((f) => {

                            User.find({}).then((id) => {
                                const users_id = id.map((i) => {
                                    return i.id
                                })
                                for (let i = 0; i < users_id.length; i++) {
                                    bot.telegram.sendPhoto(users_id[i], {url: ff},{
                                        caption:second_message.caption
                                    }).then(() =>{
                                        bot.telegram.sendVoice(users_id[i], {url: f})
                                    })

                                }
                                ctx.reply('Сообщение успешно отправлено!', Extra.markup((m) => {
                                    m.resize
                                    return m.keyboard(kb.adminFunc)
                                }))
                                ctx.wizard.back()
                                ctx.wizard.back()
                                ctx.wizard.back()
                            })
                        })
                    })
                }else{
                    bot.telegram.getFileLink(second_message.photo[second_message.photo.length-1].file_id).then((ff) => {
                        bot.telegram.getFileLink(first_message.voice.file_id).then((f) => {

                            User.find({}).then((id) => {
                                const users_id = id.map((i) => {
                                    return i.id
                                })
                                for (let i = 0; i < users_id.length; i++) {
                                    bot.telegram.sendPhoto(users_id[i], {url: ff}).then(() =>{
                                        bot.telegram.sendVoice(users_id[i], {url: f})
                                    })

                                }
                                ctx.reply('Сообщение успешно отправлено!', Extra.markup((m) => {
                                    m.resize
                                    return m.keyboard(kb.adminFunc)
                                }))
                                ctx.wizard.back()
                                ctx.wizard.back()
                                ctx.wizard.back()
                            })
                        })
                    })
                }
            }
        }
        else if (hasVideo){
            if(hasText_2){
                bot.telegram.getFileLink(first_message.video.file_id).then((f) =>{
                    User.find({}).then((id) => {
                        const users_id = id.map((i) => {
                            return i.id
                        })
                        for (let i = 0; i < users_id.length; i++) {
                            bot.telegram.sendVideo(users_id[i], {url: f}).then(() =>{
                                bot.telegram.sendMessage(users_id[i],second_message)
                            })
                        }
                        ctx.reply('Сообщение успешно отправлено!', Extra.markup((m) => {
                            m.resize
                            return m.keyboard(kb.adminFunc)
                        }))
                        ctx.wizard.back()
                        ctx.wizard.back()
                    })
                })
            }
        }
    }

    )
const sharesScene = new WizardScene('createShares',
    (ctx) =>{
        ctx.reply('Выберите товар:',Extra.markup((m) =>{
            m.resize()
            return m.keyboard()
        }))
    },
    (ctx) =>{

    }
    )
const dessertScene = new WizardScene('desserts-scene',
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
        switch (ctx.update.message.text){
            case keyboard.fast_foodPage.hamburger.name:
            case keyboard.fast_foodPage.cheese_burger.name:
            case keyboard.fast_foodPage.subway_sandwich.name:
            case keyboard.fast_foodPage.club_sandwich.name:
            case keyboard.fast_foodPage.fries_potatoes.name:
                let order_name = ctx.update.message.text
               ctx.scene.session.state = {
                    order_name:order_name
                }
                ctx.replyWithPhoto(helper.getPhoto(order_name),
                   Extra.load({caption:helper.getCaption(order_name)+`\nЦена: ${helper.getPrice(order_name).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\nВыберите или введите количество:`}).markup((m)=>{m.resize()
                            return m.keyboard(kb.counterPage)
                        })
                )
                    return ctx.wizard.next()
                break
            case keyboard.back:
                User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                    if(u.length !== 0){
                        ctx.scene.leave()
                        ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                            markup.resize()
                            return markup.keyboard(kb.main_menuSecret)
                        }))
                    }else{
                        ctx.scene.leave()
                        ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                            markup.resize()
                            return markup.keyboard(kb.main_menu)
                        }))
                    }
                })
                break
        }
    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
        if(ctx.update.message.text === keyboard.back){
            ctx.reply('Выберите десерт:',Extra.markup((m) =>{
                m.resize()
                return m.keyboard(kb.fast_food)
            }))
            return ctx.wizard.back()
        }
    if(ctx.update.message.text !== keyboard.back&&ctx.update.message.text !== keyboard.main_menuPage.basket) {
        let counter = parseInt(ctx.update.message.text)
        if(counter > 1000 ){
            ctx.reply('Максималное количество 1000!')
        }else {
            const id = ctx.hasOwnProperty('chat') ? ctx.chat.id : ctx.from.id
           Order.find({id:id,name:ctx.scene.session.state.order_name}).then(o =>{
                if(o.length !== 0){
                    const count = o.map((c) =>{
                        return `${c.count}`
                    })
                    counter += parseInt(count)

                    const price = helper.getPrice(ctx.scene.session.state.order_name) * counter
                    const dividedPrice = price / counter
                    const basket = `<b>${ctx.scene.session.state.order_name}</b>\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                    Order.find({id:id,name:ctx.scene.session.state.order_name}).remove().then(o =>console.log('not unique'))
                    if(price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
                        const order = new Order({
                            id: id,
                            name: ctx.scene.session.state.order_name,
                            price: price,
                            count: counter,
                            basket: basket
                        })
                        order.save().then(() => {
                            ctx.reply('Успешно добавлено в корзину!\nЧто-то еще?', Extra.markup((markup) => {
                                markup.resize()
                                return markup.keyboard(kb.fast_food)
                            }))
                            return ctx.wizard.back()
                        })
                    }
                    else{
                        ctx.reply('Вводите правильно!')
                    }
                }else{
                    const id = ctx.hasOwnProperty('chat') ? ctx.chat.id : ctx.from.id
                    const price = helper.getPrice(ctx.scene.session.state.order_name) * counter
                    const dividedPrice = price / counter
                    const basket = `<b>${ctx.scene.session.state.order_name}</b>\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                    if(price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
                        const order = new Order({
                            id: id,
                            name: ctx.scene.session.state.order_name,
                            price: price,
                            count: counter,
                            basket: basket
                        })
                        order.save().then(() => {
                            ctx.reply('Успешно добавлено в корзину!\nЧто-то еще?', Extra.markup((markup) => {
                                markup.resize()
                                return markup.keyboard(kb.fast_food)
                            }))
                            return ctx.wizard.back()
                        })
                    }else{
                        ctx.reply('Вводите правильно!')
                    }
                }
            })

        }

    }
    if(ctx.update.message.text === keyboard.main_menuPage.basket){
            ctx.scene.leave()
        ctx.scene.enter('take-order')
    }


    }
    )
const pizzaScene = new WizardScene('pizza-scene',
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
        switch (ctx.update.message.text){
            case keyboard.doughPage.height.subtle:
            case keyboard.doughPage.height.fat:
                const dough_height = ctx.update.message.text
                ctx.scene.session.state = {
                    dough_height:dough_height
                }
                if(dough_height !== ''){
                    ctx.reply('Выберите размер:',Extra.markup((m) =>{
                        m.resize()
                        return m.keyboard(kb.dough_sizePage)
                    }))
                    return ctx.wizard.next()
                }
                break
            case keyboard.back:
                User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                    if(u.length !== 0){
                        ctx.scene.leave()
                        ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                            markup.resize()
                            return markup.keyboard(kb.main_menuSecret)
                        }))
                    }else{
                        ctx.scene.leave()
                        ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                            markup.resize()
                            return markup.keyboard(kb.main_menu)
                        }))
                    }
                })
                break
        }
    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
        switch (ctx.update.message.text){
            case keyboard.doughPage.size.medium:
            case keyboard.doughPage.size.maximum:
                const dough_height = ctx.scene.session.state.dough_height
                const dough_size = ctx.update.message.text
                ctx.scene.session.state = {
                    dough_height:dough_height,
                    dough_size:dough_size
                }
                if(dough_size !== ''){
                    ctx.reply('Выберите пиццу:',Extra.markup((m) =>{
                        m.resize()
                       return m.keyboard(kb.pizzaPage)
                    }))
                    return ctx.wizard.next()
                }
                break
            case keyboard.back:
                ctx.reply('Выберите тесто:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.dough_heightPage)
                }))
                return ctx.wizard.back()
                break
        }
    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
        switch (ctx.update.message.text){
            case keyboard.pizzaPage.pizza_1.name:
            case keyboard.pizzaPage.pizza_2.name:
            case keyboard.pizzaPage.pizza_3.name:
            case keyboard.pizzaPage.pizza_4.name:
            case keyboard.pizzaPage.pizza_5.name:
            case keyboard.pizzaPage.pizza_6.name:
            case keyboard.pizzaPage.pizza_7.name:
            case keyboard.pizzaPage.pizza_8.name:
            case keyboard.pizzaPage.pizza_9.name:
            case keyboard.pizzaPage.pizza_10.name:
            case keyboard.pizzaPage.pizza_11.name:
            case keyboard.pizzaPage.pizza_12.name:
            case keyboard.pizzaPage.pizza_13.name:
            case keyboard.pizzaPage.pizza_14.name:
            case keyboard.pizzaPage.pizza_15.name:
            case keyboard.pizzaPage.pizza_16.name:
            case keyboard.pizzaPage.pizza_17.name:
            case keyboard.pizzaPage.pizza_18.name:
            case keyboard.pizzaPage.pizza_19.name:
            case keyboard.pizzaPage.pizza_20.name:
            case keyboard.pizzaPage.pizza_21.name:
                const dough_size = ctx.scene.session.state.dough_size
                const dough_height = ctx.scene.session.state.dough_height
                const order_name = ctx.update.message.text
                ctx.scene.session.state = {
                    dough_size:dough_size,
                    dough_height:dough_height,
                    order_name:order_name
                }
                if(order_name !== ''){
                    ctx.replyWithPhoto(helper.getPhoto(order_name),
                        Extra.load({caption:helper.getCaption(order_name)+`\nЦена: ${helper.getPrice(order_name,dough_size).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\nВыберите или введите количество:`}).markup((m)=>{m.resize()
                            return m.keyboard(kb.counterPage)
                        })
                    )
                    ctx.wizard.next()
                }
                break
            case keyboard.back:
                    ctx.reply('Выберите размер:',Extra.markup((m) =>{
                        m.resize()
                        return m.keyboard(kb.dough_sizePage)
                    }))
                    return ctx.wizard.back()
                break
            case keyboard.main_menuPage.basket:
                ctx.scene.leave()
                ctx.scene.enter('take-order')
                break
        }
    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
        if(ctx.update.message.text === keyboard.back){
            ctx.reply('Выберите пиццу:',Extra.markup((m) =>{
                m.resize()
                return m.keyboard(kb.pizzaPage)
            }))
            return ctx.wizard.back()
        }
        if(ctx.update.message.text !== keyboard.back&&ctx.update.message.text !== keyboard.main_menuPage.basket) {
            let counter = parseInt(ctx.update.message.text)
            if(counter > 1000) {
                ctx.reply('Максималное количество 1000!')
            }else {

                const id = ctx.hasOwnProperty('chat') ? ctx.chat.id : ctx.from.id

                const order_name = ctx.scene.session.state.order_name
                const dough_height = ctx.scene.session.state.dough_height
                const dough_size = ctx.scene.session.state.dough_size
                Order.find({id:id,name:order_name + ` ${dough_height} ${dough_size}`,height:dough_height,size:dough_size}).then((o) =>{
                    if(o.length !== 0){
                                const count = o.map((c) =>{
                                    return `${c.count}`
                                })
                                counter += parseInt(count)
                                const price = helper.getPrice(order_name, dough_size) * counter
                                const dividedPrice = price / counter
                                const basket = `<b>${order_name}</b>\nТесто: ${dough_height}\nРазмер: ${dough_size}\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                                Order.find({id:id,name:order_name + ` ${dough_height} ${dough_size}`,height:dough_height,size:dough_size}).remove().then(() => console.log('not unique'))
                                if(price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
                                    const order = new Order({
                                        id: id,
                                        name: order_name + ` ${dough_height} ${dough_size}`,
                                        price: price,
                                        count: counter,
                                        basket: basket,
                                        height:dough_height,
                                        size:dough_size
                                    })
                                    order.save().then(() => {
                                        ctx.reply('Успешно добавлено в корзину!\nЧто-то еще?', Extra.markup((markup) => {
                                            markup.resize()
                                            return markup.keyboard(kb.main_menu)
                                        }))
                                        return ctx.scene.leave()
                                    })
                                }else{
                                    ctx.reply('Вводите правильно')
                                }


                    }else{
                        const price = helper.getPrice(order_name,dough_size) * counter
                        const dividedPrice = price / counter
                        const basket = `<b>${order_name}</b>\nТесто: ${dough_height}\nРазмер: ${dough_size}\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                        if(price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
                            const order = new Order({
                                id: id,
                                name: order_name + ` ${dough_height} ${dough_size}`,
                                price: price,
                                count: counter,
                                basket: basket,
                                height:dough_height,
                                size:dough_size
                            })
                            order.save().then(() => {
                                ctx.reply('Успешно добавлено в корзину!\nЧто-то еще?', Extra.markup((markup) => {
                                    markup.resize()
                                    return markup.keyboard(kb.dough_heightPage)
                                }))
                                ctx.scene.leave()
                                ctx.scene.enter('pizza-scene')
                            })
                        }else{
                            ctx.reply('Вводите правильно!')
                        }
                    }
                })
            }
        }
        if(ctx.update.message.text === keyboard.main_menuPage.basket){
            ctx.scene.leave()
            ctx.scene.enter('take-order')
        }
    }
    )
const drinksScene = new WizardScene('drinks-scene',
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
    switch (ctx.update.message.text){
        case keyboard.drinksPage.fresh.name:
        case keyboard.drinksPage.coffee.name:
        case keyboard.drinksPage.energize.name:
            const choice = ctx.update.message.text
            if(choice === keyboard.drinksPage.coffee.name){
                ctx.reply('Какой кофе вы хотите?',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.drinks_hot)
                }))
                ctx.wizard.next()
            }
            else if(choice === keyboard.drinksPage.energize.name){
                ctx.reply('Выберите энергетик:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.energize_page)
                }))
                ctx.wizard.next()
            }
            else{
                ctx.reply('Выберите напиток:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.drinks_fresh)
                }))
                ctx.wizard.next()
            }
            break
        case keyboard.back:
            User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.scene.leave()
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.scene.leave()
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
            break

    }
    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
    switch (ctx.update.message.text){
        case keyboard.drinksPage.fresh.cola.name:
        case keyboard.drinksPage.fresh.fanta.name:
        case keyboard.drinksPage.fresh.water.name:
        case keyboard.drinksPage.fresh.juice.name:
        case keyboard.drinksPage.fresh.sprite.name:
            const order_name = ctx.update.message.text
            ctx.scene.session.state = {
                order_name:order_name,
                index:1
            }
            if(order_name !== ''){

                ctx.replyWithPhoto(helper.getPhoto(order_name),
                    Extra.load({caption:helper.getCaption(order_name)+`\nЦена: ${helper.getPrice(order_name).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\nВыберите или введите количество:`}).markup((m)=>{m.resize()
                        return m.keyboard(kb.counterPage)
                    })
                )
                return ctx.wizard.next()
            }

            break
        case keyboard.drinksPage.energize.eighteen_plus.name:
        case keyboard.drinksPage.energize.flash.name:
        case keyboard.drinksPage.energize.red_bull.name:
            const ordername = ctx.update.message.text
            const price_ = helper.getPrice(ordername)

            ctx.replyWithPhoto(helper.getPhoto(ordername),
                Extra.load({caption:helper.getCaption(ordername)+`\nЦена: ${price_.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\nВыберите или введите количество:`}).markup((m)=>{m.resize()
                    return m.keyboard(kb.counterPage)
                })
            )
            ctx.scene.session.state = {
                energize:ordername,
                index:1
            }
            ctx.wizard.next()
            break
        case keyboard.drinksPage.coffee.hot.grand_capuchino.name:
        case keyboard.drinksPage.coffee.hot.latte.name:
        case keyboard.drinksPage.coffee.hot.americano.name:
        case keyboard.drinksPage.coffee.hot.capuchino.name:
            const orderName = ctx.update.message.text
            const price = helper.getPrice(orderName)

            ctx.replyWithPhoto(helper.getPhoto(orderName),
                Extra.load({caption:helper.getCaption(orderName)+`\nЦена: ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\nВыберите или введите количество:`}).markup((m)=>{m.resize()
                    return m.keyboard(kb.counterPage)
                })
            )
            ctx.scene.session.state = {
                choice:orderName,
                index:1
            }
            ctx.wizard.next()
            break
        case keyboard.back:
                ctx.reply('Выберите напиток:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.drinks)
                }))
                ctx.wizard.back()
            break

        }
    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
        const order_name = ctx.scene.session.state.order_name || ''
        const choice = ctx.scene.session.state.choice || ''
        const energize = ctx.scene.session.state.energize || ''
        if(order_name !== ''){
            if(ctx.update.message.text === keyboard.main_menuPage.basket){
                ctx.scene.leave()
                ctx.scene.enter('take-order')
            }
            if(ctx.update.message.text === keyboard.back && ctx.update.message.text !== keyboard.main_menuPage.basket){
                ctx.reply('Выберите напиток:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.drinks_fresh)
                }))
                ctx.wizard.back()
            }else {
                let counter = parseInt(ctx.update.message.text)
                if(counter > 1000) {
                    ctx.reply('Максималное количество 1000!')
                }else {

                    const id = ctx.hasOwnProperty('chat') ? ctx.chat.id : ctx.from.id
                    Order.find({id:id,name:order_name}).then((o) =>{
                        if(o.length !== 0){
                            const count = o.map((c) =>{
                                return `${c.count}`
                            })
                            counter += parseInt(count)
                            const price = helper.getPrice(order_name) * counter
                            const dividedPrice = price / counter
                            const basket = `<b>${order_name}</b>\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                            Order.find({id:id,name:order_name}).remove().then(o =>console.log('not unique'))
                            if(price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
                                const order = new Order({
                                    id: id,
                                    name: order_name,
                                    price: price,
                                    count: counter,
                                    basket: basket
                                })
                                order.save().then(() => {
                                    ctx.reply('Успешно добавлено в корзину!\nЧто-то еще?', Extra.markup((markup) => {
                                        markup.resize()
                                        return markup.keyboard(kb.drinks_fresh)
                                    }))
                                    ctx.wizard.back()
                                })
                            }
                            else{
                                ctx.reply('Вводите правильно!')
                            }
                        }else{

                            const price = helper.getPrice(order_name) * counter
                            const dividedPrice = price / counter
                            const basket = `<b>${order_name}</b>\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                            if(price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
                                const order = new Order({
                                    id: id,
                                    name: order_name,
                                    price: price,
                                    count: counter,
                                    basket: basket
                                })
                                order.save().then(() => {
                                    ctx.reply('Успешно добавлено в корзину!\nЧто-то еще?', Extra.markup((markup) => {
                                        markup.resize()
                                        return markup.keyboard(kb.drinks_fresh)
                                    }))

                                    ctx.wizard.back()

                                })
                            }else{
                                ctx.reply('Вводите правильно!')
                            }
                        }
                    })

                }
            }
        }
        if(choice !== ''&& order_name === '') {
                switch (choice) {
                    case keyboard.drinksPage.coffee.hot.grand_capuchino.name:
                    case keyboard.drinksPage.coffee.hot.latte.name:
                    case keyboard.drinksPage.coffee.hot.americano.name:
                    case keyboard.drinksPage.coffee.hot.capuchino.name:
                        const orderName = choice
                        if (ctx.update.message.text === keyboard.main_menuPage.basket) {
                            ctx.scene.leave()
                            ctx.scene.enter('take-order')
                        }
                        if (ctx.update.message.text !== keyboard.back && ctx.update.message.text !== keyboard.main_menuPage.basket) {

                            let counter = parseInt(ctx.update.message.text)
                            if (counter > 1000) {
                                ctx.reply('Максималное количество 1000!')
                            } else {
                                const id = ctx.hasOwnProperty('chat') ? ctx.chat.id : ctx.from.id
                                Order.find({id: id, name: orderName}).then((o) => {
                                    if (o.length !== 0) {
                                        let count = o.map((c) => {
                                            return `${c.count}`
                                        })
                                        counter += parseInt(count)
                                        const price = helper.getPrice(orderName) * counter
                                        const dividedPrice = price / counter
                                        const basket = `<b>${orderName}</b>\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                                        Order.find({
                                            id: id,
                                            name: orderName
                                        }).remove().then(o => console.log('not unique'))
                                        if (price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
                                            const order = new Order({
                                                id: id,
                                                name: orderName,
                                                price: price,
                                                count: counter,
                                                basket: basket
                                            })

                                                order.save().then(() => {
                                                    ctx.reply('Успешно добавлено в корзину!\nЧто-то еще?', Extra.markup((markup) => {
                                                        markup.resize()
                                                        return markup.keyboard(kb.drinks_hot)
                                                    }))

                                                })
                                                ctx.wizard.back()


                                        } else {
                                            ctx.reply('Вводите правильно!')
                                        }
                                    } else {
                                        const price = helper.getPrice(orderName) * counter
                                        const dividedPrice = price / counter
                                        const basket = `<b>${orderName}</b>\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                                        if (price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
                                            const order = new Order({
                                                id: id,
                                                name: orderName,
                                                price: price,
                                                count: counter,
                                                basket: basket
                                            })
                                                order.save().then(() => {
                                                    ctx.reply('Успешно добавлено в корзину!\nЧто-то еще?', Extra.markup((markup) => {
                                                        markup.resize()
                                                        return markup.keyboard(kb.drinks_hot)
                                                    }))

                                                })
                                                ctx.wizard.back()

                                        } else {
                                            ctx.reply('Вводите правильно!')
                                        }
                                    }
                                })

                            }
                        }
                        if(ctx.update.message.text === keyboard.back){
                            ctx.reply('Какой кофе вы хотите?',Extra.markup((m) =>{
                                m.resize()
                                return m.keyboard(kb.drinks_hot)
                            }))
                            ctx.wizard.back()
                        }
                }
            }
        if(energize !== ''){
            if(ctx.update.message.text === keyboard.main_menuPage.basket){
                ctx.scene.leave()
                ctx.scene.enter('take-order')
            }
            if(ctx.update.message.text === keyboard.back && ctx.update.message.text !== keyboard.main_menuPage.basket){
                ctx.reply('Выберите энергетик:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.drinks_fresh)
                }))
                ctx.wizard.back()
            }else {
                let counter = parseInt(ctx.update.message.text)
                if(counter > 1000) {
                    ctx.reply('Максималное количество 1000!')
                }else {

                    const id = ctx.hasOwnProperty('chat') ? ctx.chat.id : ctx.from.id
                    Order.find({id:id,name:energize}).then((o) =>{
                        if(o.length !== 0){
                            const count = o.map((c) =>{
                                return `${c.count}`
                            })
                            counter += parseInt(count)
                            const price = helper.getPrice(energize) * counter
                            const dividedPrice = price / counter
                            const basket = `<b>${energize}</b>\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                            Order.find({id:id,name:energize}).remove().then(o =>console.log('not unique'))
                            if(price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
                                const order = new Order({
                                    id: id,
                                    name: energize,
                                    price: price,
                                    count: counter,
                                    basket: basket
                                })
                                order.save().then(() => {
                                    ctx.reply('Успешно добавлено в корзину!\nЧто-то еще?', Extra.markup((markup) => {
                                        markup.resize()
                                        return markup.keyboard(kb.energize_page)
                                    }))
                                    ctx.wizard.back()
                                })
                            }
                            else{
                                ctx.reply('Вводите правильно!')
                            }
                        }else{

                            const price = helper.getPrice(energize) * counter
                            const dividedPrice = price / counter
                            const basket = `<b>${energize}</b>\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                            if(price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
                                const order = new Order({
                                    id: id,
                                    name: energize,
                                    price: price,
                                    count: counter,
                                    basket: basket
                                })
                                order.save().then(() => {
                                    ctx.reply('Успешно добавлено в корзину!\nЧто-то еще?', Extra.markup((markup) => {
                                        markup.resize()
                                        return markup.keyboard(kb.energize_page)
                                    }))

                                    ctx.wizard.back()

                                })
                            }else{
                                ctx.reply('Вводите правильно!')
                            }
                        }
                    })

                }
            }
        }
    }
    )
const takeOrderScene = new WizardScene('take-order',
    (ctx) =>{
        if(ctx.update.message.text !== keyboard.back) {
            helper.getBasketById(ctx.from.id).then((basket) =>{
                helper.getSumById(ctx.from.id).then((sum)=>{
                    if(basket === ''){
                        User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                            if(u.length !== 0){
                                ctx.reply(`Ваша корзина пуста((`, Extra.markup((markup) => {
                                    markup.resize()
                                    return markup.keyboard(kb.main_menuSecret)
                                }))
                                ctx.scene.leave()
                            }else{
                                ctx.reply(`Ваша корзина пуста((`,Extra.markup((markup) =>{
                                    markup.resize()
                                    return markup.keyboard(kb.main_menu)
                                }))
                                ctx.scene.leave()
                            }
                        })

                    }else {
                        Order.find({id:ctx.update.message.from.id}).then((o) =>{
                            let buttons =[]
                            buttons.length = 65
                            for (let i = 0; i < buttons.length; i++) {
                                buttons[i] = ''
                            }

                            let s = o.map((o) => {
                                return `${o.name}`
                            })
                            for (let i = 0; i < s.length; i++) {
                                buttons[i] = '❌ ' + s[i]
                            }

                            ctx.replyWithHTML('Ваша корзина:\n\n' + basket + 'Итого: ' + sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум', Extra.markup((m) => {
                                m.resize()
                                return m.keyboard([
                                    [keyboard.basketPage.clear],
                                    [buttons[0],buttons[1]],
                                    [buttons[2],buttons[3]],
                                    [buttons[4],buttons[5]],
                                    [buttons[6],buttons[7]],
                                    [buttons[8],buttons[9]],
                                    [buttons[10],buttons[11]],
                                    [buttons[12],buttons[13]],
                                    [buttons[14],buttons[15]],
                                    [buttons[16],buttons[17]],
                                    [buttons[18],buttons[19]],
                                    [buttons[20],buttons[21]],
                                    [buttons[22],buttons[23]],
                                    [buttons[24],buttons[25]],
                                    [buttons[26],buttons[27]],
                                    [buttons[28],buttons[29]],
                                    [buttons[30],buttons[31]],
                                    [buttons[32],buttons[33]],
                                    [buttons[34],buttons[35]],
                                    [buttons[36],buttons[37]],
                                    [buttons[38],buttons[39]],
                                    [buttons[40],buttons[41]],
                                    [buttons[42],buttons[43]],
                                    [buttons[44],buttons[45]],
                                    [buttons[46],buttons[47]],
                                    [buttons[48],buttons[49]],
                                    [buttons[50],buttons[51]],
                                    [buttons[52],buttons[53]],
                                    [buttons[54],buttons[55]],
                                    [buttons[56],buttons[57]],
                                    [buttons[58],buttons[59]],
                                    [buttons[60],buttons[61]],
                                    [buttons[62],buttons[63]],
                                    [buttons[64]],
                                    [keyboard.back,keyboard.basketPage.take_an_order]

                                ])
                            }))
                        })

                    }
                })

            })
            return ctx.wizard.next()
        }
    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
        if(ctx.update.message.text === keyboard.basketPage.take_an_order){
            ctx.replyWithHTML('<b>Введите</b> или <b>отправьте</b> свой номер телефона:\n📱+998## ### ## ##',Extra.markup((m) =>{
                m.resize()
                return m.keyboard(kb.first)
            }))
            return ctx.wizard.next()
        }
        if(ctx.update.message.text === keyboard.basketPage.clear){
            Order.find({id:ctx.update.message.from.id}).remove().then(()=>{
                ctx.reply('Успешно удалено',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.main_menu)
                }))
            })
            ctx.scene.leave()

        }
        if(ctx.update.message.text === keyboard.back){
            User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.scene.leave()
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.scene.leave()
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }

    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
    if(ctx.update.message.text !== keyboard.back){
        let phone
        if(ctx.update.message.hasOwnProperty('contact')){
            phone = ctx.update.message.contact.phone_number
        }else{
            phone = ctx.update.message.text
        }
        if(phone !== ''&&phone.indexOf('998') + 1 &&phone.length === 13||phone.length === 12||phone.length === 14 && phone !== undefined){
            ctx.scene.session.state = {
                phone:phone.replace(/\+/gi, '')
            }
            ctx.replyWithHTML('<b>Введите</b> или <b>отправьте</b> адрес:',Extra.markup((m) =>{
                m.resize()
                return m.keyboard(kb.second)
            }))
            return ctx.wizard.next()
        }else {
            ctx.reply('Введите корректный номер:')
        }
    }
    else{
        helper.getBasketById(ctx.from.id).then((basket) =>{
            helper.getSumById(ctx.from.id).then((sum)=>{
                if(basket === ''){
                    ctx.reply('Ваша корзина пуста((',Extra.markup((m) =>{
                        m.resize()
                        return m.keyboard(kb.main_menu)
                    }))
                }else {
                    Order.find({id:ctx.update.message.from.id}).then((o) =>{
                        let buttons =[]
                        buttons.length = 65
                        for (let i = 0; i < buttons.length; i++) {
                            buttons[i] = ''
                        }

                        let s = o.map((o) => {
                            return `${o.name}`
                        })
                        for (let i = 0; i < s.length; i++) {
                            buttons[i] = '❌ ' + s[i]
                        }

                        ctx.replyWithHTML('Ваша корзина:\n\n' + basket + 'Итого: ' + sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум', Extra.markup((m) => {
                            m.resize()
                            return m.keyboard([
                                [keyboard.basketPage.clear],
                                [buttons[0],buttons[1]],
                                [buttons[2],buttons[3]],
                                [buttons[4],buttons[5]],
                                [buttons[6],buttons[7]],
                                [buttons[8],buttons[9]],
                                [buttons[10],buttons[11]],
                                [buttons[12],buttons[13]],
                                [buttons[14],buttons[15]],
                                [buttons[16],buttons[17]],
                                [buttons[18],buttons[19]],
                                [buttons[20],buttons[21]],
                                [buttons[22],buttons[23]],
                                [buttons[24],buttons[25]],
                                [buttons[26],buttons[27]],
                                [buttons[28],buttons[29]],
                                [buttons[30],buttons[31]],
                                [buttons[32],buttons[33]],
                                [buttons[34],buttons[35]],
                                [buttons[36],buttons[37]],
                                [buttons[38],buttons[39]],
                                [buttons[40],buttons[41]],
                                [buttons[42],buttons[43]],
                                [buttons[44],buttons[45]],
                                [buttons[46],buttons[47]],
                                [buttons[48],buttons[49]],
                                [buttons[50],buttons[51]],
                                [buttons[52],buttons[53]],
                                [buttons[54],buttons[55]],
                                [buttons[56],buttons[57]],
                                [buttons[58],buttons[59]],
                                [buttons[60],buttons[61]],
                                [buttons[62],buttons[63]],
                                [buttons[64]],
                                [keyboard.back,keyboard.basketPage.take_an_order]

                            ])
                        }))
                    })
                }
            })

        })
        return ctx.wizard.back()
        }
    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
    if(ctx.update.message.text !== keyboard.back){
        let location
        const phone = ctx.scene.session.state.phone
        helper.getBasketById(ctx.update.message.from.id).then((basket) =>{
        helper.getSumById(ctx.update.message.from.id).then((price) =>{

            if(ctx.update.message.hasOwnProperty('location')){
                id++
                const feed = new Feed({
                    id:ctx.update.message.from.id,
                    message:basket
                })
                feed.save().then(() =>{
                    bot.telegram.sendMessage(-1001309044485, `Заказ №${id} ( ${ctx.update.message.from.hasOwnProperty('username') ? '@' + ctx.update.message.from.username : ctx.update.message.from.first_name} )\n|${ctx.message.from.id}|\n\n+${phone}\n\n` + `https://yandex.ru/maps/10335/tashkent/?ll=69.264021%2C41.280466&z=19&rtext=41.279797%2C69.262203~${ctx.update.message.location.latitude}%2C${ctx.update.message.location.longitude}&rtt=auto&mode=routes\n-----------------------\n\n` + basket + 'Итого: ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум', {
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_markup: {
                            inline_keyboard:[
                                [{text:'Принять',callback_data:'took'}]
                            ]
                        }
                    })
                    User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                        if(u.length !== 0){
                            ctx.reply(`Ваш заказ успешно отправлен!`, Extra.markup((markup) => {
                                markup.resize()
                                return markup.keyboard(kb.main_menuSecret)
                            }))
                        }else{
                            ctx.reply(`Ваш заказ успешно отправлен!`,Extra.markup((markup) =>{
                                markup.resize()
                                return markup.keyboard(kb.main_menu)
                            }))
                        }
                    })
                    helper.deleteAllById(ctx.update.message.from.id)
                    ctx.scene.leave()
                })
            }else{
                id++
                location = ctx.update.message.text
                if(location.length < 4){
                    ctx.reply('Введите корректный адрес:')
                }else {
                    const feed = new Feed({
                        id:ctx.update.message.from.id,
                        message:basket
                    })
                    feed.save().then(() =>{
                        bot.telegram.sendMessage(-1001309044485, `Заказ №${id} ( ${ctx.update.message.from.hasOwnProperty('username') ? '@'+ctx.update.message.from.username : ctx.update.message.from.first_name} )\n|${ctx.message.from.id}|\n\n+${phone}\n\n` + `${location}\n-----------------------\n\n` + basket + 'Итого: ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум', {
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_markup: {
                                inline_keyboard:[
                                    [{text:'Принять',callback_data:'took'}]
                                ]
                            }
                        })
                        User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                            if(u.length !== 0){
                                ctx.reply(`Ваш заказ успешно отправлен!`, Extra.markup((markup) => {
                                    markup.resize()
                                    return markup.keyboard(kb.main_menuSecret)
                                }))
                            }else{
                                ctx.reply(`Ваш заказ успешно отправлен!`,Extra.markup((markup) =>{
                                    markup.resize()
                                    return markup.keyboard(kb.main_menu)
                                }))
                            }
                        })
                        helper.deleteAllById(ctx.update.message.from.id)
                        ctx.scene.leave()
                    })
                }
            }
                })
            })

    }else{
        ctx.replyWithHTML('<b>Введите</b> или <b>отправьте</b> свой номер телефона:\n📱+998## ### ## ##',Extra.markup((m) =>{
            m.resize()
            return m.keyboard(kb.first)
        }))
        return ctx.wizard.back()
    }
}
    )
bot.action('took',(ctx) =>{
    const {message_id} = ctx.update.callback_query.message
    const button = `Принял: ${ctx.update.callback_query.from.first_name}`
    const reply_markup = {
        inline_keyboard:[
            [{text:button,callback_data:'1'}],
            [{text:'Уже в пути',callback_data:'going'}]
        ]
    }
    Feed.find({isTook:false}).then(u =>{
        const id = u.map((id) =>{
            return id.id
        })
        const basket = u.map((b) =>{
            return `${b.message}`
        })
        for(let i = 0; i < id.length; i++){
            if(ctx.update.callback_query.message.text.includes(id[i])){
                bot.telegram.sendMessage(id[i],'Ваш заказ принял: '+ctx.update.callback_query.from.first_name).then(() =>{
                    Feed.findOneAndDelete({id:id[i],message:basket[i],isTook:false}).then(() =>{
                        let feed = new Feed({
                            id:id[i],
                            message:basket[i],
                            isTook:true
                        })
                        feed.save().then(() =>{
                            console.log('Принят')
                        })
                    })

                })
            }
        }
    })
    ctx.editMessageReplyMarkup(reply_markup,{
        message_id:message_id
    })

})
bot.action('going',(ctx) =>{
    const {message_id} = ctx.update.callback_query.message
    const button = `Принял: ${ctx.update.callback_query.from.first_name}`
    const message = ctx.update.callback_query.message.text
    const id = message.substring(
        message.indexOf("|") + 1,
        message.lastIndexOf("|")
    )
    const reply_markup = {
        inline_keyboard:[
            [{text:button,callback_data:'1'}],
            [{text:'Уже в пути',callback_data:'2'}]
        ]
    }
    Feed.find({isTook:true,id:id}).then(u =>{
        const id = u.map((id) =>{
            return id.id
        })
        const basket = u.map((b) =>{
            return `${b.message}`
        })
        for(let i = 0; i < id.length; i++){
            if(ctx.update.callback_query.message.text.includes(id[i])){
                bot.telegram.sendMessage(id[i],'Машина выехала').then(() =>{
                    Feed.find({id:id,message:basket,isTook:true}).remove().then(() =>{
                        console.log('removed')
                    })
                })
            }
        }
    })
    ctx.editMessageReplyMarkup(reply_markup,{
        message_id:message_id
    })

})

bot.action('1',(ctx) =>{
    ctx.answerCbQuery('Заказ уже принят!','Заказ уже принят!',true)
})
bot.action('2',(ctx) =>{
    ctx.answerCbQuery('Оповещение уже отправлено!','Оповещение уже отправлено!',true)
})
bot.hears(keyboard.main_menuPage.all_menus_btn,ctx => {
    return ctx.replyWithPhoto({source:'images/pizza_menu.png'},Extra.markup((m) =>{
        return m.inlineKeyboard([
            [{text:'Instagram',url:'https://instagram.com/baker_street_pizzabar'}],
            [{text:'Facebook',url:'https://facebook.com/bakerstreetpizzabar'}]
        ])
    }))
})

const stage = new Stage([dessertScene,pizzaScene,drinksScene,takeOrderScene,panelScene],{default_scene:''})
bot.use(Session())
takeOrderScene.hears(/❌ (.+)/,ctx =>{
    helper.getDoughHeight(ctx.from.id,ctx.match[0].substring(2,ctx.match[0].length)).then((dough_height) =>{
        helper.getDoughSize(ctx.from.id,ctx.match[0].substring(2,ctx.match[0].length)).then((dough_size) =>{
                if(typeof dough_height === "undefined"&&typeof dough_size === "undefined") {
                    Order.findOne({
                        id: ctx.update.message.from.id,
                        name: ctx.match[0].substring(2, ctx.match[0].length)
                    }).remove().then((o) => {
                        helper.getBasketById(ctx.from.id).then((basket) => {
                            helper.getSumById(ctx.from.id).then((sum) => {
                                Order.find({id: ctx.update.message.from.id}).then((o) => {
                                    let buttons = []
                                    buttons.length = 65
                                    for (let i = 0; i < buttons.length; i++) {
                                        buttons[i] = ''
                                    }

                                    let s = o.map((o) => {
                                        return `${o.name}`
                                    })
                                    for (let i = 0; i < s.length; i++) {
                                        buttons[i] = '❌ ' + s[i]
                                    }
                                    if (basket !== '') {

                                        ctx.replyWithHTML('Ваша корзина:\n\n' + basket + 'Итого: ' + sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум', Extra.markup((m) => {
                                            m.resize()
                                            return m.keyboard([
                                                [keyboard.basketPage.clear],
                                                [buttons[0], buttons[1]],
                                                [buttons[2], buttons[3]],
                                                [buttons[4], buttons[5]],
                                                [buttons[6], buttons[7]],
                                                [buttons[8], buttons[9]],
                                                [buttons[10], buttons[11]],
                                                [buttons[12], buttons[13]],
                                                [buttons[14], buttons[15]],
                                                [buttons[16], buttons[17]],
                                                [buttons[18], buttons[19]],
                                                [buttons[20], buttons[21]],
                                                [buttons[22], buttons[23]],
                                                [buttons[24], buttons[25]],
                                                [buttons[26], buttons[27]],
                                                [buttons[28], buttons[29]],
                                                [buttons[30], buttons[31]],
                                                [buttons[32], buttons[33]],
                                                [buttons[34], buttons[35]],
                                                [buttons[36], buttons[37]],
                                                [buttons[38], buttons[39]],
                                                [buttons[40], buttons[41]],
                                                [buttons[42], buttons[43]],
                                                [buttons[44], buttons[45]],
                                                [buttons[46], buttons[47]],
                                                [buttons[48], buttons[49]],
                                                [buttons[50], buttons[51]],
                                                [buttons[52], buttons[53]],
                                                [buttons[54], buttons[55]],
                                                [buttons[56], buttons[57]],
                                                [buttons[58], buttons[59]],
                                                [buttons[60], buttons[61]],
                                                [buttons[62], buttons[63]],
                                                [buttons[64]],
                                                [keyboard.back, keyboard.basketPage.take_an_order]

                                            ])
                                        }))
                                    } else {
                                        User.find({id: ctx.update.message.from.id, isAdmin: true}).then((u) => {
                                            if (u.length !== 0) {
                                                ctx.reply(`Ваша корзина пуста((`, Extra.markup((markup) => {
                                                    markup.resize()
                                                    return markup.keyboard(kb.main_menuSecret)
                                                }))
                                                ctx.scene.leave()
                                            } else {
                                                ctx.reply(`Ваша корзина пуста((`, Extra.markup((markup) => {
                                                    markup.resize()
                                                    return markup.keyboard(kb.main_menu)
                                                }))
                                                ctx.scene.leave()
                                            }
                                        })
                                    }
                                })
                            })

                        })
                    })
                }
                if(typeof dough_size !== "undefined" &&typeof dough_height!=="undefined"){
                    Order.findOne({id:ctx.update.message.from.id,name:ctx.match[0].substring(2,ctx.match[0].length),height:dough_height,size:dough_size}).remove().then((o) =>{
                        helper.getBasketById(ctx.from.id).then((basket) =>{
                            helper.getSumById(ctx.from.id).then((sum)=>{
                                Order.find({id:ctx.update.message.from.id}).then((o) =>{
                                    let buttons =[]
                                    buttons.length = 65
                                    for (let i = 0; i < buttons.length; i++) {
                                        buttons[i] = ''
                                    }

                                    let s = o.map((o) => {
                                        return `${o.name}`
                                    })
                                    for (let i = 0; i < s.length; i++) {
                                        buttons[i] = '❌ ' + s[i]
                                    }
                                    if(basket !== ''){

                                        ctx.replyWithHTML('Ваша корзина:\n\n' + basket + 'Итого: ' + sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум', Extra.markup((m) => {
                                            m.resize()
                                            return m.keyboard([
                                                [keyboard.basketPage.clear],
                                                [buttons[0],buttons[1]],
                                                [buttons[2],buttons[3]],
                                                [buttons[4],buttons[5]],
                                                [buttons[6],buttons[7]],
                                                [buttons[8],buttons[9]],
                                                [buttons[10],buttons[11]],
                                                [buttons[12],buttons[13]],
                                                [buttons[14],buttons[15]],
                                                [buttons[16],buttons[17]],
                                                [buttons[18],buttons[19]],
                                                [buttons[20],buttons[21]],
                                                [buttons[22],buttons[23]],
                                                [buttons[24],buttons[25]],
                                                [buttons[26],buttons[27]],
                                                [buttons[28],buttons[29]],
                                                [buttons[30],buttons[31]],
                                                [buttons[32],buttons[33]],
                                                [buttons[34],buttons[35]],
                                                [buttons[36],buttons[37]],
                                                [buttons[38],buttons[39]],
                                                [buttons[40],buttons[41]],
                                                [buttons[42],buttons[43]],
                                                [buttons[44],buttons[45]],
                                                [buttons[46],buttons[47]],
                                                [buttons[48],buttons[49]],
                                                [buttons[50],buttons[51]],
                                                [buttons[52],buttons[53]],
                                                [buttons[54],buttons[55]],
                                                [buttons[56],buttons[57]],
                                                [buttons[58],buttons[59]],
                                                [buttons[60],buttons[61]],
                                                [buttons[62],buttons[63]],
                                                [buttons[64]],
                                                [keyboard.back,keyboard.basketPage.take_an_order]

                                            ])
                                        }))
                                    }else{
                                        User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
                                            if(u.length !== 0){
                                                ctx.reply(`Ваша корзина пуста((`, Extra.markup((markup) => {
                                                    markup.resize()
                                                    return markup.keyboard(kb.main_menuSecret)
                                                }))
                                                ctx.scene.leave()
                                            }else{
                                                ctx.reply(`Ваша корзина пуста((`,Extra.markup((markup) =>{
                                                    markup.resize()
                                                    return markup.keyboard(kb.main_menu)
                                                }))
                                                ctx.scene.leave()
                                            }
                                        })
                                    }
                                })
                            })

                        })
                    })
                }

            })
    })

})

bot.use(stage.middleware())
bot.hears(keyboard.main_menuPage.fast_food,ctx => {
    ctx.reply('Выберите еду:',Extra.markup((m) =>{
        m.resize()
        return m.keyboard(kb.fast_food)
    }))
    ctx.scene.enter('desserts-scene')
})
bot.hears(keyboard.main_menuPage.drinks,ctx => {
    ctx.reply('Выберите тип напитка:',Extra.markup((m) =>{
        m.resize()
        return m.keyboard(kb.drinks)
    }))
    ctx.scene.enter('drinks-scene')
})
bot.hears(keyboard.main_menuPage.pizza_btn,ctx => {
    ctx.reply('Выберите тесто:',Extra.markup((m) =>{
        m.resize()
        return m.keyboard(kb.dough_heightPage)
    }))
    ctx.scene.enter('pizza-scene')
})
bot.hears(keyboard.main_menuPage.basket,ctx => {
    ctx.scene.enter('take-order')
})
bot.hears(keyboard.main_menuPage_Secret.adminPanel,ctx=>{
    User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{

        if(u.length !== 0){
            ctx.reply(`Добро пожаловать в панель администратора!\n`,
                Extra.markup((markup) => {
                markup.resize()
                return markup.keyboard(kb.adminFunc)
            }))
            ctx.scene.enter('adminScene')
        }
    })
})
takeOrderScene.hears(keyboard.mainMenu,ctx => {
    User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
        if(u.length !== 0){
            ctx.scene.leave()
            ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                markup.resize()
                return markup.keyboard(kb.main_menuSecret)
            }))
        }else{
            ctx.scene.leave()
            ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                markup.resize()
                return markup.keyboard(kb.main_menu)
            }))
        }
    })
})
pizzaScene.hears(keyboard.mainMenu,ctx => {
    User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
        if(u.length !== 0){
            ctx.scene.leave()
            ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                markup.resize()
                return markup.keyboard(kb.main_menuSecret)
            }))
        }else{
            ctx.scene.leave()
            ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                markup.resize()
                return markup.keyboard(kb.main_menu)
            }))
        }
    })
})
drinksScene.hears(keyboard.mainMenu,ctx => {
    User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
        if(u.length !== 0){
            ctx.scene.leave()
            ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                markup.resize()
                return markup.keyboard(kb.main_menuSecret)
            }))
        }else{
            ctx.scene.leave()
            ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                markup.resize()
                return markup.keyboard(kb.main_menu)
            }))
        }
    })
})
dessertScene.hears(keyboard.mainMenu,ctx => {
    User.find({id:ctx.update.message.from.id,isAdmin:true}).then((u) =>{
        if(u.length !== 0){
            ctx.scene.leave()
            ctx.reply(`Выберите категорию:`, Extra.markup((markup) => {
                markup.resize()
                return markup.keyboard(kb.main_menuSecret)
            }))
        }else{
            ctx.scene.leave()
            ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                markup.resize()
                return markup.keyboard(kb.main_menu)
            }))
        }
    })
})
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

            })
        }
        if(!p){
            User.find({id:telegramID,isAdmin:true}).then((u) =>{
                if(u.length !== 0){
                    ctx.reply(`Добро пожаловать в наш бот!`, Extra.markup((markup) => {
                        markup.resize()
                        return markup.keyboard(kb.main_menuSecret)
                    }))
                }else{
                    ctx.reply(`Добро пожаловать в наш бот!`,Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.main_menu)
                    }))
                }
            })
        }
    }).catch(error => ctx.reply(`Что-то пошло не так\n${error}`))
})
//bot.command('/get',ctx =>{
  //  ctx.reply(ctx.update.message.from.id)
//})
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
