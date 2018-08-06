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
            case prices.dessertsPage.eklerchiki.name:
                return price = prices.dessertsPage.eklerchiki.price
                break
            case prices.dessertsPage.lemon_cake.name:
                return price = prices.dessertsPage.lemon_cake.price
                break
            case prices.dessertsPage.nut_cake.name:
                return price = prices.dessertsPage.nut_cake.price
                break
            case prices.dessertsPage.usual_cake.name:
                return price = prices.dessertsPage.usual_cake.price
                break
            case prices.dessertsPage.honey_cake.name:
                return price = prices.dessertsPage.honey_cake.price
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
            case prices.drinksPage.coffee.cold.ice_latte.name:
                return price = prices.drinksPage.coffee.cold.ice_latte.price
                break
            case prices.drinksPage.coffee.cold.bumble.name:
                return price = prices.drinksPage.coffee.cold.bumble.price
                break
            case prices.drinksPage.fresh.juice.name:
                return price = prices.drinksPage.fresh.juice.price
                break
            case prices.drinksPage.fresh.water.name:
                return price = prices.drinksPage.fresh.water.price
                break
            case prices.drinksPage.fresh.compot.name:
                if(amount === prices.counter_drinks._350ml.name){
                   return price = prices.counter_drinks._350ml.compot_price
                }
                if(amount === prices.counter_drinks._500ml.name){
                    return price = prices.counter_drinks._500ml.compot_price
                }
                if(amount === prices.counter_drinks._1000ml.name){
                    return price = prices.counter_drinks._1000ml.compot_price
                }
                if(amount === prices.counter_drinks._1500ml.name){
                    return price = prices.counter_drinks._1500ml.compot_price
                }
                break
            case prices.drinksPage.fresh.cola.name:
                if(amount === prices.counter_drinks._350ml.name){
                    return price = prices.counter_drinks._350ml.cola_price
                }
                if(amount === prices.counter_drinks._500ml.name){
                    return price = prices.counter_drinks._500ml.cola_price
                }
                if(amount === prices.counter_drinks._1000ml.name){
                    return price = prices.counter_drinks._1000ml.cola_price
                }
                if(amount === prices.counter_drinks._1500ml.name){
                    return price = prices.counter_drinks._1500ml.cola_price
                }
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
            case prices.drinksPage.fresh.compot.name:
                if(amount === prices.counter_drinks._500ml.name){
                    return { source: 'images/Compot500.jpg' }
                }
                else if(amount === prices.counter_drinks._1000ml.name){
                    return { source: 'images/Compot1000.jpg' }
                }else{
                    return { source: 'images/Water.jpg' }
                }
                break
            case prices.drinksPage.fresh.cola.name:
            case prices.drinksPage.fresh.water.name:
            case prices.drinksPage.fresh.juice.name:
                return { source: 'images/Water.jpg' }
                break
            case prices.dessertsPage.lemon_cake.name:
                return { source: 'images/LEMON_TART.jpg' }
                break
            case prices.dessertsPage.nut_cake.name:
                return { source: 'images/NUTS_CAKE.jpg' }
                break
            case prices.dessertsPage.usual_cake.name:
                return { source: 'images/APPLE_CAKE.jpg' }
                break
            case prices.dessertsPage.honey_cake.name:
                return { source: 'images/APPLE_TART.jpg' }
                break
            case prices.dessertsPage.eklerchiki.name:
                return { source: 'images/EKLERCHIKI.jpg' }
                break
            case prices.drinksPage.coffee.hot.capuchino.name:
                return { source: 'images/Capuchino.jpg' }
                break
            case prices.drinksPage.coffee.cold.bumble.name:
                return { source: 'images/Bambl.jpg' }
                break
            case prices.drinksPage.coffee.hot.grand_capuchino.name:
            case prices.drinksPage.coffee.hot.latte.name:
            case prices.drinksPage.coffee.hot.americano.name:
            case prices.drinksPage.coffee.cold.ice_latte.name:

                return { source: 'images/coffee.jpg' }
                break
        }
    },
    getCaption(name){
        switch (name){
            case prices.pizzaPage.pizza_1.name:
                return '🍕Маргарита'
                break
            case prices.pizzaPage.pizza_2.name:
                return '🍕Пеперони'
                break
            case prices.pizzaPage.pizza_3.name:
                return '🍕Доминиканская'
                break
            case prices.pizzaPage.pizza_10.name:
                return '🍕Вегетарианская'
                break
            case prices.pizzaPage.pizza_5.name:
                return '🍕BBQ CHICKEN'
                break
            case prices.pizzaPage.pizza_4.name:
                return '🍕BBQ BEEF'
                break
            case prices.pizzaPage.pizza_7.name:
                return '🍕Охотничья'
                break
            case prices.pizzaPage.pizza_8.name:
                return '🍕Гавайская'
                break
            case prices.pizzaPage.pizza_9.name:
                return '🍕4 Сезона'
                break
            case prices.pizzaPage.pizza_6.name:
                return '🍕Special'
                break
            case prices.pizzaPage.pizza_11.name:
                return '🍕Комбинированная'
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
            case prices.drinksPage.coffee.cold.ice_latte.name:
                return '☕Айс-латте'
                break
            case prices.drinksPage.coffee.cold.bumble.name:
                return '☕Бамбл'
                break
            case prices.dessertsPage.lemon_cake.name:
                return '🍧Лимонный тарт'
                break
            case prices.dessertsPage.nut_cake.name:
                return '🍧Ореховый тарт'
                break
            case prices.dessertsPage.usual_cake.name:
                return '🍧Яблочный штрудель'
                break
            case prices.dessertsPage.honey_cake.name:
                return '🍧Яблочный тарт'
                break
            case prices.dessertsPage.eklerchiki.name:
                return '🍧Эклерчики с лимоном и шоколадом'
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
            case prices.drinksPage.fresh.compot.name:
                return '🍸Компот'
                break
        }
    }
}