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
mongoose.Promise = global.Promise
mongoose.connect('mongodb://Shark:ruslan2002@ds161751.mlab.com:61751/mydb',{
    useNewUrlParser:true
})
    .then(() => console.log('Connected'))
    .catch(e => console.log(e))
require('./user.model')
require('./order.model')
const User = mongoose.model('user')
const Order = mongoose.model('order')
const dessertScene = new WizardScene('desserts-scene',
    (ctx) => {
        if(ctx.update.message.text === '/start'){
            ctx.scene.leave()
            return ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
        }
        switch (ctx.update.message.text){
            case keyboard.dessertsPage.lemon_cake.name:
            case keyboard.dessertsPage.usual_cake.name:
            case keyboard.dessertsPage.honey_cake.name:
            case keyboard.dessertsPage.eklerchiki.name:
            case keyboard.dessertsPage.nut_cake.name:
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
                ctx.reply('Выберите кагеторию',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.main_menu)
                }))
                return ctx.scene.leave()
                break
        }
    },
    (ctx) => {
        if(ctx.update.message.text === '/start'){
            ctx.scene.leave()
            return ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
        }
        if(ctx.update.message.text === keyboard.back){
            ctx.reply('Выберите десерт:',Extra.markup((m) =>{
                m.resize()
                return m.keyboard(kb.desserts)
            }))
            return ctx.wizard.back()
        }
    if(ctx.update.message.text !== keyboard.back&&ctx.update.message.text !== keyboard.main_menuPage.basket) {
            console.log(ctx.scene.session)
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
                                return markup.keyboard(kb.main_menu)
                            }))
                            return ctx.scene.leave()
                        })
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
                                return markup.keyboard(kb.main_menu)
                            }))
                            return ctx.scene.leave()
                        })
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
            ctx.scene.leave()
            return ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
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
                ctx.reply('Выберите кагеторию:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.main_menu)
                }))
                return ctx.scene.leave()
                break
        }
    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
            ctx.scene.leave()
            return ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
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
            ctx.scene.leave()
            return ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
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
        }
    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
            ctx.scene.leave()
            return ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
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
                                }


                    }else{
                        const price = helper.getPrice(order_name, dough_size) * counter
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
                                    return markup.keyboard(kb.main_menu)
                                }))
                                return ctx.scene.leave()
                            })
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
            ctx.scene.leave()
            return ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
        }
    switch (ctx.update.message.text){
        case keyboard.drinksPage.fresh.name:
        case keyboard.drinksPage.coffee.name:
            const choice = ctx.update.message.text
            if(choice === keyboard.drinksPage.coffee.name){
                ctx.reply('Какой кофе вы хотите?',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.drinks_hot_cold)
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
            ctx.reply('Выберите кагеторию:',Extra.markup((m) =>{
                m.resize()
                return m.keyboard(kb.main_menu)
            }))
            return ctx.scene.leave()
            break

    }
    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
            ctx.scene.leave()
            return ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
        }
    switch (ctx.update.message.text){
        case keyboard.drinksPage.fresh.cola.name:
        case keyboard.drinksPage.fresh.compot.name:
            const name = ctx.update.message.text
            ctx.scene.session.state = {
                name:name,
                index:1
            }
            if(name !== ''){
                ctx.reply('Выберите объем:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.counter_drinks)
                }))
                return ctx.wizard.next()
            }

            break
        case keyboard.drinksPage.fresh.water.name:
        case keyboard.drinksPage.fresh.juice.name:
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
        case keyboard.drinksPage.coffee.hot.name:
        case keyboard.drinksPage.coffee.cold.name:
            const choice = ctx.update.message.text
            ctx.scene.session.state = {
                choice:choice,
                index:2
            }
            if(choice === keyboard.drinksPage.coffee.hot.name){
                ctx.reply('Выберите кофе:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.drinks_hot)
                }))
                return ctx.wizard.next()
            }else{
                ctx.reply('Выберите кофе:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.drinks_cold)
                }))
                return ctx.wizard.next()
            }

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
            ctx.scene.leave()
            return ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
        }
        const order_name = ctx.scene.session.state.order_name || ''
        const name = ctx.scene.session.state.name || ''
        const choice = ctx.scene.session.state.choice
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
                                        return markup.keyboard(kb.main_menu)
                                    }))
                                    return ctx.scene.leave()
                                })
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
                                        return markup.keyboard(kb.main_menu)
                                    }))
                                    return ctx.scene.leave()
                                })
                            }
                        }
                    })

                }
            }
        }
        if(name !== ''){
        if(ctx.update.message.text === keyboard.counter_drinks._350ml.name || ctx.update.message.text === keyboard.counter_drinks._500ml.name || ctx.update.message.text === keyboard.counter_drinks._1000ml.name || ctx.update.message.text === keyboard.counter_drinks._1500ml.name  ) {
            if (ctx.update.message.text === keyboard.back) {
                ctx.reply('Выберите напиток:', Extra.markup((m) => {
                    m.resize()
                    return m.keyboard(kb.drinks_fresh)
                }))
                ctx.wizard.back()
            }else {
                const amount = ctx.update.message.text
                const price = helper.getPrice(name, amount)
                ctx.scene.session.state = {
                    amount: amount,
                    name: name
                }
                ctx.replyWithPhoto(helper.getPhoto(name),
                    Extra.load({caption: helper.getCaption(name) + `\nЦена: ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\nОбъем: ${amount}\n\nВыберите или введите количество:`}).markup((m) => {
                        m.resize()
                        return m.keyboard(kb.counterPage)
                    })
                )
                if (amount !== '') {
                    return ctx.wizard.next()
                }
            }
        }

        }
            if(choice !== ''&& order_name === '' && name === ''){
            switch (ctx.update.message.text){
                case keyboard.drinksPage.coffee.hot.grand_capuchino.name:
                case keyboard.drinksPage.coffee.hot.latte.name:
                case keyboard.drinksPage.coffee.hot.americano.name:
                case keyboard.drinksPage.coffee.hot.capuchino.name:
                case keyboard.drinksPage.coffee.cold.ice_latte.name:
                case keyboard.drinksPage.coffee.cold.bumble.name:
                    const orderName = ctx.update.message.text
                    if(orderName === keyboard.drinksPage.coffee.hot.grand_capuchino.name || orderName === keyboard.drinksPage.coffee.hot.capuchino.name || orderName === keyboard.drinksPage.coffee.hot.latte.name || orderName === keyboard.drinksPage.coffee.hot.americano.name){
                        ctx.scene.session.state = {
                            orderName:orderName,
                            index:1
                        }
                    }else{
                        ctx.scene.session.state = {
                            orderName:orderName,
                            index:2
                        }
                    }
                    const price = helper.getPrice(orderName)

                    ctx.replyWithPhoto(helper.getPhoto(orderName),
                        Extra.load({caption:helper.getCaption(orderName)+`\nЦена: ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\nВыберите или введите количество:`}).markup((m)=>{m.resize()
                            return m.keyboard(kb.counterPage)
                        })
                    )
                    if(orderName !== ''){
                        return ctx.wizard.next()
                    }
                    break
                case keyboard.back:
                    ctx.reply('Какой кофе вы хотите?',Extra.markup((m) =>{
                        m.resize()
                        return m.keyboard(kb.drinks_hot_cold)
                    }))
                    return ctx.wizard.back()
                    break
            }
            }
    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
            ctx.scene.leave()
            return ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
        }
        const amount = ctx.scene.session.state.amount || ''
        const orderName = ctx.scene.session.state.orderName || ''
        if(amount !== ''){
            if(ctx.update.message.text === keyboard.main_menuPage.basket){
                ctx.scene.leave()
                ctx.scene.enter('take-order')
            }
            if(ctx.update.message.text === keyboard.back &&ctx.update.message.text !== keyboard.main_menuPage.basket){
                ctx.reply('Выберите объем:',Extra.markup((m) =>{
                    m.resize()
                    return m.keyboard(kb.counter_drinks)
                }))
                ctx.wizard.back()
            }else {
                let counter = parseInt(ctx.update.message.text)
                if(counter > 1000) {
                    ctx.reply('Максималное количество 1000!')
                }else {
                    const id = ctx.hasOwnProperty('chat') ? ctx.chat.id : ctx.from.id
                    const name = ctx.scene.session.state.name
                    Order.find({id:id,name:name+ ' '+ amount}).then((o) =>{
                        if(o.length !== 0) {
                            const count = o.map((c) => {
                                return `${c.count}`
                            })
                            counter += parseInt(count)
                            const price = helper.getPrice(name, amount) * counter
                            const dividedPrice = price / counter
                            const basket = `<b>${name}</b>\nОбъем: ${amount}\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                            Order.find({id:id,name:name+ ' '+ amount,amount:amount}).remove().then(o =>console.log('not unique'))
                            if(price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
                                const order = new Order({
                                    id: id,
                                    name: name + ' '+ amount,
                                    price: price,
                                    count: counter,
                                    basket: basket,
                                    amount: amount
                                })
                                order.save().then(() => {
                                    ctx.reply('Успешно добавлено в корзину!\nЧто-то еще?', Extra.markup((markup) => {
                                        markup.resize()
                                        return markup.keyboard(kb.main_menu)
                                    }))
                                    return ctx.scene.leave()
                                })
                            }
                        }else{
                            const price = helper.getPrice(name, amount) * counter
                            const dividedPrice = price / counter
                            const basket = `<b>${name}</b>\nОбъем: ${amount}\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                            if(price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
                                const order = new Order({
                                    id: id,
                                    name: name + ' '+ amount,
                                    price: price,
                                    count: counter,
                                    basket: basket,
                                    amount: amount
                                })
                                order.save().then(() => {
                                    ctx.reply('Успешно добавлено в корзину!\nЧто-то еще?', Extra.markup((markup) => {
                                        markup.resize()
                                        return markup.keyboard(kb.main_menu)
                                    }))
                                    return ctx.scene.leave()
                                })
                            }
                        }
                    })


                }
            }
        }
        if(orderName !== ''){
            if(ctx.update.message.text === keyboard.main_menuPage.basket){
                ctx.scene.leave()
                ctx.scene.enter('take-order')
            }
            if(ctx.update.message.text !== keyboard.back && ctx.update.message.text !== keyboard.main_menuPage.basket){

            let counter = parseInt(ctx.update.message.text)
                if(counter > 1000) {
                    ctx.reply('Максималное количество 1000!')
                }else {
                    const id = ctx.hasOwnProperty('chat') ? ctx.chat.id : ctx.from.id
                    Order.find({id:id,name:orderName}).then((o) =>{
                        if(o.length !== 0){
                            let count = o.map((c) =>{
                                return `${c.count}`
                            })
                            counter += parseInt(count)
                            const price = helper.getPrice(orderName) * counter
                            const dividedPrice = price / counter
                            const basket = `<b>${orderName}</b>\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                            Order.find({id:id,name:orderName}).remove().then(o =>console.log('not unique'))
                            if(price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
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
                                        return markup.keyboard(kb.main_menu)
                                    }))
                                    return ctx.scene.leave()
                                })
                            }
                        }else{
                            const price = helper.getPrice(orderName) * counter
                            const dividedPrice = price / counter
                            const basket = `<b>${orderName}</b>\n${counter} x ${dividedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'} = ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум'}\n\n`
                            if(price !== 0 && !isNaN(price) && counter !== 0 && !isNaN(counter)) {
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
                                        return markup.keyboard(kb.main_menu)
                                    }))
                                    return ctx.scene.leave()
                                })
                            }
                        }
                    })

                }
            }else{
                const index = ctx.scene.session.state.index || ''
                if(index === 1){
                    ctx.reply('Выберите кофе:',Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.drinks_hot)
                    }))
                    return ctx.wizard.back()
                }else{
                    ctx.reply('Выберите кофе:',Extra.markup((markup) =>{
                        markup.resize()
                        return markup.keyboard(kb.drinks_cold)
                    }))
                    return ctx.wizard.back()
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
                        ctx.reply('Ваша корзина пуста((',Extra.markup((m) =>{
                            m.resize()
                            return m.keyboard(kb.main_menu)
                        }))
                        ctx.scene.leave()
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
            ctx.scene.leave()
            return ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
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
            ctx.reply('Выберите категорию',Extra.markup((m) =>{
                m.resize()
                return m.keyboard(kb.main_menu)
            }))
            return ctx.scene.leave()
        }

    },
    (ctx) =>{
        if(ctx.update.message.text === '/start'){
            ctx.scene.leave()
            return ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
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
                        buttons.length = 11
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
                                [buttons[10]],
                                [keyboard.basketPage.take_an_order,keyboard.back]

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
            ctx.scene.leave()
            return ctx.reply(`Выберите категорию:`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
        }
    if(ctx.update.message.text !== keyboard.back){
        let location
        const phone = ctx.scene.session.state.phone
        helper.getBasketById(ctx.update.message.from.id).then((basket) =>{
        helper.getSumById(ctx.update.message.from.id).then((price) =>{

            if(ctx.update.message.hasOwnProperty('location')){
                id++
                bot.telegram.sendMessage(-1001309044485, `Заказ №${id} ( @${ctx.update.message.from.username} )\n+${phone}\n\n` + `https://yandex.ru/maps/10335/tashkent/?ll=69.264021%2C41.280466&z=19&rtext=41.279797%2C69.262203~${ctx.update.message.location.latitude}%2C${ctx.update.message.location.longitude}&rtt=auto&mode=routes\n-----------------------\n\n` + basket + 'Итого: ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум', {
                    disable_web_page_preview: true,
                    parse_mode:'HTML'
                })
                ctx.reply('Ваш заказ успешно отправлен!',Extra.markup((m)=>{
                    m.resize()
                    return m.keyboard(kb.main_menu)
                }))
                helper.deleteAllById(ctx.update.message.from.id)
                ctx.scene.leave()
            }else{
                id++
                location = ctx.update.message.text
                if(location.length < 4){
                    ctx.reply('Введите корректный адрес:')
                }else {
                    bot.telegram.sendMessage(-1001309044485, `Заказ №${id} ( @${ctx.update.message.from.username} )\n+${phone}\n\n` + `${location}\n-----------------------\n\n` + basket + 'Итого: ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' сум', {
                        disable_web_page_preview: true,
                        parse_mode: 'HTML'
                    })
                    ctx.reply('Ваш заказ успешно отправлен!', Extra.markup((m) => {
                        m.resize()
                        return m.keyboard(kb.main_menu)
                    }))
                    helper.deleteAllById(ctx.update.message.from.id)
                    ctx.scene.leave()
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
            [{text:button,callback_data:'1'}]
        ]
    }
    ctx.editMessageReplyMarkup(reply_markup,{
        message_id:message_id
    })

})

bot.action('1',(ctx) =>{
    ctx.answerCbQuery('Заказ уже принят!','Заказ уже принят!',true)
})
bot.hears(keyboard.main_menuPage.all_menus_btn,ctx => {
    return ctx.replyWithPhoto({ source:'images/pizza_menu.png' }, Markup.inlineKeyboard([
        Markup.urlButton('Все меню', 'http://telegra.ph/Pizzabar-08-03'),
    ]).extra())
})





const stage = new Stage([dessertScene,pizzaScene,drinksScene,takeOrderScene],{default_scene:''})
bot.use(Session())

takeOrderScene.hears(/❌ (.+)/,ctx =>{
    helper.getDoughHeight(ctx.from.id,ctx.match[0].substring(2,ctx.match[0].length)).then((dough_height) =>{
        helper.getDoughSize(ctx.from.id,ctx.match[0].substring(2,ctx.match[0].length)).then((dough_size) =>{
            helper.getAmount(ctx.from.id,ctx.match[0].substring(2,ctx.match[0].length)).then((amount) =>{
                if(typeof amount === "undefined"&&typeof dough_height === "undefined"&&typeof dough_size === "undefined"){
                    Order.findOne({id:ctx.update.message.from.id,name:ctx.match[0].substring(2,ctx.match[0].length)}).remove().then((o) =>{
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
                                        ctx.scene.leave()
                                        ctx.reply('Ваша корзина пуста((',Extra.markup((m) =>{
                                            m.resize()
                                            return m.keyboard(kb.main_menu)
                                        }))
                                    }
                                })
                            })

                        })
                    })
                }
                if(typeof amount !== "undefined" && typeof dough_size === "undefined" &&typeof dough_height==="undefined"){
                    Order.findOneAndDelete({id:ctx.update.message.from.id,name:ctx.match[0].substring(2,ctx.match[0].length),amount:amount}).then((o) =>{
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
                                        ctx.scene.leave()
                                        ctx.reply('Ваша корзина пуста((',Extra.markup((m) =>{
                                            m.resize()
                                            return m.keyboard(kb.main_menu)
                                        }))
                                    }
                                })
                            })

                        })
                    })
                }

                if(typeof dough_size !== "undefined" &&typeof dough_height!=="undefined" &&typeof amount === "undefined"){
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
                                        ctx.scene.leave()
                                        ctx.reply('Ваша корзина пуста((',Extra.markup((m) =>{
                                            m.resize()
                                            return m.keyboard(kb.main_menu)
                                        }))
                                    }
                                })
                            })

                        })
                    })
                }

            })
        })
    })

})

bot.use(stage.middleware())
bot.hears(keyboard.main_menuPage.desserts,ctx => {
    ctx.reply('Выберите десерт:',Extra.markup((m) =>{
        m.resize()
        return m.keyboard(kb.desserts)
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
bot.hears(/\/start/,(ctx) => {

    const telegramID = ctx.message.hasOwnProperty('chat') ? ctx.message.chat.id : ctx.message.from.id
    const user = new User({
        id:telegramID
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
            return ctx.reply(`Добро пожаловать в наш бот!`,Extra.markup((markup) =>{
                return markup.resize()
                    .keyboard(kb.main_menu)
            }))
        }
    }).catch(error => ctx.reply(`Что-то пошло не так\n${error}`))
})
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
    console.log("Listening on Port "+port);
});
bot.startPolling()