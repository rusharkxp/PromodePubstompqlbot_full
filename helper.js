const prices = require('./keyboard-buttons')
const mongoose = require('mongoose')
    require('./user.model')
    require('./order.model')
    const User = mongoose.model('user')
    const Order = mongoose.model('order')

module.exports = {
    isNewUser(id){
      return User.find({id:id}).then((u) =>{
          if(u.length === 0){
              return true
          }
          if(u.length > 0) {
              return false
          }

      })
    },
    getBasketById(id){
        return Order.find({id:id}).then((o) =>{
            const basket = o.map((b) =>{
                return `${b.basket}`
            })
            let message = ''
            for(let i = 0; i < basket.length; i++){
                if(basket[i] !== '' && basket[i] !== undefined){
                    message += basket[i]
                }
            }
            return message
        })
    },
    getSumById(id){
      return Order.find({id:id}).then((p) =>{
          const price = p.map((price) =>{
              return `${price.price}`
          })
          let sum = 0
          for(let i = 0; i < price.length; i++){
              if(price[i] !== '' && price[i] !== undefined){
                  sum += parseInt(price[i])
              }
          }
          return sum
      })
    },
    deleteAllById(id){
        Order.find({id:id}).remove().then(_ => console.log('removed'))
    },
    getDoughSize(id,name){
      return Order.findOne({id:id,name:name}).then((dough) =>{
         const dough_size = dough.size
          return dough_size
      })
    },
    getDoughHeight(id,name){
        return Order.findOne({id:id,name:name}).then((dough) =>{
            const dough_height = dough.height
            return dough_height
        })
    },
    getAmount(id,name){
        return Order.findOne({id:id,name:name}).then(a =>{
            const amount = a.amount
            return amount
        })
    },
    getPrice(name,amount){
        let price = 0
        switch (name){
            case prices.pizzaPage.pizza_1.name:
                if(amount === prices.doughPage.size.medium) {
                return price = prices.pizzaPage.pizza_1.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_1.price_maximum
                }

                break
            case prices.pizzaPage.pizza_2.name:
                if(amount === prices.doughPage.size.medium) {
                return price = prices.pizzaPage.pizza_2.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_2.price_maximum
                }

                break
            case prices.pizzaPage.pizza_3.name:
                if(amount === prices.doughPage.size.medium) {
                return price = prices.pizzaPage.pizza_3.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_3.price_maximum
                }

                break
            case prices.pizzaPage.pizza_4.name:
                if(amount === prices.doughPage.size.medium) {
                return price = prices.pizzaPage.pizza_4.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_4.price_maximum
                }

                break
            case prices.pizzaPage.pizza_5.name:
                if(amount === prices.doughPage.size.medium) {
                return price = prices.pizzaPage.pizza_5.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_5.price_maximum
                }

                break
            case prices.pizzaPage.pizza_6.name:
                if(amount === prices.doughPage.size.medium) {
                return price = prices.pizzaPage.pizza_6.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_6.price_maximum
                }

                break
            case prices.pizzaPage.pizza_7.name:
                if(amount === prices.doughPage.size.medium) {
                return price = prices.pizzaPage.pizza_7.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_7.price_maximum
                }

                break
            case prices.pizzaPage.pizza_8.name:
                if(amount === prices.doughPage.size.medium) {
                return price = prices.pizzaPage.pizza_8.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_8.price_maximum
                }
                break
            case prices.pizzaPage.pizza_9.name:
                if(amount === prices.doughPage.size.medium) {
                    return price = prices.pizzaPage.pizza_9.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_9.price_maximum
                }

                break
            case prices.pizzaPage.pizza_10.name:
                if(amount === prices.doughPage.size.medium) {
                    return price = prices.pizzaPage.pizza_10.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_10.price_maximum
                }

                break
            case prices.pizzaPage.pizza_11.name:
                if(amount === prices.doughPage.size.medium) {
                    return price = prices.pizzaPage.pizza_11.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_11.price_maximum
                }

                break
            case prices.pizzaPage.pizza_12.name:
                if(amount === prices.doughPage.size.medium) {
                    return price = prices.pizzaPage.pizza_12.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_12.price_maximum
                }

                break
            case prices.pizzaPage.pizza_13.name:
                if(amount === prices.doughPage.size.medium) {
                    return price = prices.pizzaPage.pizza_13.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_13.price_maximum
                }

                break
            case prices.pizzaPage.pizza_14.name:
                if(amount === prices.doughPage.size.medium) {
                    return price = prices.pizzaPage.pizza_14.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_14.price_maximum
                }

                break
            case prices.pizzaPage.pizza_15.name:
                if(amount === prices.doughPage.size.medium) {
                    return price = prices.pizzaPage.pizza_15.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_15.price_maximum
                }

                break
            case prices.pizzaPage.pizza_16.name:
                if(amount === prices.doughPage.size.medium) {
                    return price = prices.pizzaPage.pizza_16.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_16.price_maximum
                }

                break
            case prices.pizzaPage.pizza_17.name:
                if(amount === prices.doughPage.size.medium) {
                    return price = prices.pizzaPage.pizza_17.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_17.price_maximum
                }

                break
            case prices.pizzaPage.pizza_18.name:
                if(amount === prices.doughPage.size.medium) {
                    return price = prices.pizzaPage.pizza_18.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_18.price_maximum
                }

                break
            case prices.pizzaPage.pizza_19.name:
                if(amount === prices.doughPage.size.medium) {
                    return price = prices.pizzaPage.pizza_19.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_19.price_maximum
                }
                break
            case prices.pizzaPage.pizza_20.name:
                if(amount === prices.doughPage.size.medium) {
                    return price = prices.pizzaPage.pizza_20.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_20.price_maximum
                }

                break
            case prices.pizzaPage.pizza_21.name:
                if(amount === prices.doughPage.size.medium) {
                    return price = prices.pizzaPage.pizza_21.price
                }
                if(amount === prices.doughPage.size.maximum){
                    return price = prices.pizzaPage.pizza_21.price_maximum
                }

                break
            case prices.fast_foodPage.fries_potatoes.name:
                return price = prices.fast_foodPage.fries_potatoes.price
                break
            case prices.fast_foodPage.hamburger.name:
                return price = prices.fast_foodPage.hamburger.price
                break
            case prices.fast_foodPage.cheese_burger.name:
                return price = prices.fast_foodPage.cheese_burger.price
                break
            case prices.fast_foodPage.subway_sandwich.name:
                return price = prices.fast_foodPage.subway_sandwich.price
                break
            case prices.fast_foodPage.club_sandwich.name:
                return price = prices.fast_foodPage.club_sandwich.price
                break
            case prices.drinksPage.coffee.hot.grand_capuchino.name:
                return price = prices.drinksPage.coffee.hot.grand_capuchino.price
                break
            case prices.drinksPage.coffee.hot.capuchino.name:
                return price = prices.drinksPage.coffee.hot.capuchino.price
                break
            case prices.drinksPage.coffee.hot.latte.name:
                return price = prices.drinksPage.coffee.hot.latte.price
                break
            case prices.drinksPage.coffee.hot.americano.name:
                return price = prices.drinksPage.coffee.hot.americano.price
                break
            case prices.drinksPage.fresh.juice.name:
                return price = prices.drinksPage.fresh.juice.price
                break
            case prices.drinksPage.fresh.water.name:
                return price = prices.drinksPage.fresh.water.price
                break

            case prices.drinksPage.fresh.fanta.name:
                return price = prices.drinksPage.fresh.fanta.price
                break
            case prices.drinksPage.fresh.cola.name:
                return price = prices.drinksPage.fresh.cola.price
                break
            case prices.drinksPage.fresh.sprite.name:
                return price = prices.drinksPage.fresh.sprite.price
                break
            case prices.drinksPage.energize.eighteen_plus.name:
                return price = prices.drinksPage.energize.eighteen_plus.price
                break
            case prices.drinksPage.energize.flash.name:
                return price = prices.drinksPage.energize.flash.price
                break
            case prices.drinksPage.energize.red_bull.name:
                return price = prices.drinksPage.energize.red_bull.price
                break

        }

    },
    getToken(){
        return '694226891:AAEqvAh4o3ROCGB4rYD50VvZHeSPzTnDyVA'
    },
    getPhoto(name,amount){
        switch (name){
            case prices.pizzaPage.pizza_1.name:
                return { source: 'images/MARGARITA.jpg' }

                break
            case prices.pizzaPage.pizza_2.name:
                return { source: 'images/PEPERONI.jpg' }

                break
            case prices.pizzaPage.pizza_3.name:
                return { source: 'images/DOMINICANIAN.jpg' }

                break
            case prices.pizzaPage.pizza_10.name:
                return { source: 'images/VEGETERIAN.jpg' }

                break
            case prices.pizzaPage.pizza_5.name:
                return { source: 'images/BBQ_CHICKEN.jpg' }

                break
            case prices.pizzaPage.pizza_4.name:
                return { source: 'images/BBQ_BEEF.jpg' }

                break
            case prices.pizzaPage.pizza_7.name:
                return { source: 'images/HUNTERS.jpg' }

                break
            case prices.pizzaPage.pizza_8.name:
                return { source: 'images/HAWAI.jpg' }

                break
            case prices.pizzaPage.pizza_9.name:
                return { source: 'images/4_SEASONS.jpg' }

                break
            case prices.pizzaPage.pizza_6.name:
                return { source: 'images/SPECIAL.jpg' }

                break
            case prices.pizzaPage.pizza_11.name:
                return { source: 'images/COMBINE.jpg' }
                break
            case prices.pizzaPage.pizza_12.name:
                return { source: 'images/MARGARITA.jpg' }

                break
            case prices.pizzaPage.pizza_13.name:
                return { source: 'images/PEPERONI.jpg' }

                break
            case prices.pizzaPage.pizza_14.name:
                return { source: 'images/DOMINICANIAN.jpg' }

                break
            case prices.pizzaPage.pizza_15.name:
                return { source: 'images/VEGETERIAN.jpg' }

                break
            case prices.pizzaPage.pizza_16.name:
                return { source: 'images/BBQ_CHICKEN.jpg' }

                break
            case prices.pizzaPage.pizza_17.name:
                return { source: 'images/BBQ_BEEF.jpg' }

                break
            case prices.pizzaPage.pizza_18.name:
                return { source: 'images/HUNTERS.jpg' }

                break
            case prices.pizzaPage.pizza_19.name:
                return { source: 'images/HAWAI.jpg' }

                break
            case prices.pizzaPage.pizza_20.name:
                return { source: 'images/4_SEASONS.jpg' }

                break
            case prices.pizzaPage.pizza_21.name:
                return { source: 'images/SPECIAL.jpg' }

                break
            case prices.drinksPage.fresh.fanta.name:
                    return { source: 'images/Water.jpg' }
                break
            case prices.drinksPage.fresh.sprite.name:
                return { source: 'images/Water.jpg' }
                break
            case prices.drinksPage.fresh.cola.name:
            case prices.drinksPage.fresh.water.name:
            case prices.drinksPage.fresh.juice.name:
            case prices.drinksPage.energize.eighteen_plus.name:
            case prices.drinksPage.energize.flash.name:
            case prices.drinksPage.energize.red_bull.name:
                return { source: 'images/Water.jpg' }
                break
            case prices.fast_foodPage.hamburger.name:
                return { source: 'images/LEMON_TART.jpg' }
                break
            case prices.fast_foodPage.cheese_burger.name:
                return { source: 'images/NUTS_CAKE.jpg' }
                break
            case prices.fast_foodPage.subway_sandwich.name:
                return { source: 'images/APPLE_CAKE.jpg' }
                break
            case prices.fast_foodPage.fries_potatoes.name:
                return { source: 'images/APPLE_TART.jpg' }
                break
            case prices.fast_foodPage.club_sandwich.name:
                return { source: 'images/EKLERCHIKI.jpg' }
                break
            case prices.drinksPage.coffee.hot.capuchino.name:
                return { source: 'images/Capuchino.jpg' }
                break
            case prices.drinksPage.coffee.hot.grand_capuchino.name:
            case prices.drinksPage.coffee.hot.latte.name:
            case prices.drinksPage.coffee.hot.americano.name:

                return { source: 'images/coffee.jpg' }
                break
        }
    },
    getCaption(name){
        switch (name){
            case prices.pizzaPage.pizza_1.name:
                return '🍕Маргарита\nИнгридиенты: Томатный соус, Сыр, Помидоры'
                break
            case prices.pizzaPage.pizza_2.name:
                return '🍕Пеперони\nИнгридиенты: Томатный соус, Сыр, Колбаса, Пепперони'
                break
            case prices.pizzaPage.pizza_3.name:
                return '🍕Доминиканская\nИнгридиенты: Томатный соус, Сыр, Копченное бонфиле, Кукуруза'
                break
            case prices.pizzaPage.pizza_10.name:
                return '🍕Вегетариана\nИнгридиенты: Томатный соус, Сыр, Томаты, Болгарский перец, Грибы, Оливки'
                break
            case prices.pizzaPage.pizza_5.name:
                return '🍕Барбекю Чикен\nИнгридиенты: Томатный соус, Сыр, Курица барбекю, Болгарский перец, Шампиньоны'
                break
            case prices.pizzaPage.pizza_4.name:
                return '🍕Барбекю Биф\nИнгридиенты: Томатный соус, Сыр, Говядина барбекю, Болгарский перец, Шампиньоны'
                break
            case prices.pizzaPage.pizza_7.name:
                return '🍕Охотничья\nИнгридиенты: Томатный соус, Сыр, Охотничьи колбаски, Грибы, Томаты'
                break
            case prices.pizzaPage.pizza_8.name:
                return '🍕Гавайская\nИнгридиенты: Томатный соус, Сыр, Ананасы'
                break
            case prices.pizzaPage.pizza_9.name:
                return '🍕4 Сезона\nИнгридиенты: Томатный соус, Сыр, Шампиньоны, Колбаса, Ветчина, Помидоры'
                break
            case prices.pizzaPage.pizza_6.name:
                return '🍕От Шефа\nИнгридиенты: Томатный соус, Сыр, Фарш говяжий, Копченная колбаса, Индейка, Томаты, Грибы'
                break
            case prices.pizzaPage.pizza_11.name:
                return '🍕Комбинированная\nИнгридиенты: Томатный соус, Сыр, Колбаса копченная, Варенная, Индейка, Болгарский перец, Томаты, Грибы, Оливки'
                break
            case prices.pizzaPage.pizza_12.name:
                return '🍕Пицца с руколлой\nИнгридиенты: Томатный соус, Сыр, Руколла, Помидоры'
                break
            case prices.pizzaPage.pizza_13.name:
                return '🍕4 Сыра\nИнгридиенты: Томатный соус, Сыр, 4 Вида сыра'
                break
            case prices.pizzaPage.pizza_14.name:
                return '🍕Делишес\nИнгридиенты: Томатный соус, Сыр, Скумбрия, Шампиньоны, Оливки'
                break
            case prices.pizzaPage.pizza_15.name:
                return '🍕Пикантино\nИнгридиенты: Томатный соус, Сыр, Перец чили, Шампиньоны, Болгарский перец, Оливки, Соус чили'
                break
            case prices.pizzaPage.pizza_16.name:
                return '🍕Чиз пицца\nИнгридиенты: Томатный соус, Сыр'
                break
            case prices.pizzaPage.pizza_17.name:
                return '🍕Цезарь пицца\nИнгридиенты: Томатный соус, Сыр пармезан, Соус "цезарь", Куринная грудка, Айсберг, Черри'
                break
            case prices.pizzaPage.pizza_18.name:
                return '🍕Шокопицца\nИнгридиенты: Шоколадный сыр, Бананы'
                break
            case prices.pizzaPage.pizza_19.name:
                return '🍕Дабл пепперони\nИнгридиенты: Томатный соус, Сыр, Колбаса пепперони x2'
                break
            case prices.pizzaPage.pizza_20.name:
                return '🍕Грибная пицца\nИнгридиенты: Томатный соус, Сыр, Шампиньоны'
                break
            case prices.pizzaPage.pizza_21.name:
                return '🍕Чиполлиноа\nИнгридиенты: Томатный соус, Сыр, Лук шалот, Орегано'
                break
            case prices.drinksPage.coffee.hot.grand_capuchino.name:
                return '☕️Гранд-капучино'
                break
            case prices.drinksPage.coffee.hot.capuchino.name:
                return '☕Капучино'
                break
            case prices.drinksPage.coffee.hot.latte.name:
                return '☕Латте'
                break
            case prices.drinksPage.coffee.hot.americano.name:
                return '☕Американо'
                break
            case prices.fast_foodPage.hamburger.name:
                return '🍔Бургер'
                break
            case prices.fast_foodPage.cheese_burger.name:
                return '🍔Чизбургер'
                break
            case prices.fast_foodPage.subway_sandwich.name:
                return '🥪Subway сандвич'
                break
            case prices.fast_foodPage.club_sandwich.name:
                return '🥪Club сандвич'
                break
            case prices.fast_foodPage.fries_potatoes.name:
                return '🍟Фри'
                break
            case prices.drinksPage.fresh.juice.name:
                return '🍸Сок'
                break
            case prices.drinksPage.fresh.water.name:
                return '🍸Вода'
                break
            case prices.drinksPage.fresh.cola.name:
                return '🍸Кола'
                break
            case prices.drinksPage.fresh.fanta.name:
                return '🍸Фанта'
                break
            case prices.drinksPage.fresh.sprite.name:
                return '🍸Спрайт'
                break
            case prices.drinksPage.energize.eighteen_plus.name:
                return '🍸18+'
                break
            case prices.drinksPage.energize.flash.name:
                return '🍸Флеш'
                break
            case prices.drinksPage.energize.red_bull.name:
                return '🍸Редбулл'
                break
        }
    }
}