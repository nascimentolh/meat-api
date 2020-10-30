import * as restify from 'restify'
import { Restaurant, RestaurantDocument } from './restaurants.model'
import { ModelRouter } from '../common/model-router'
import { NotFoundError } from 'restify-errors'

class RestaurantsRouter extends ModelRouter<RestaurantDocument> {
  constructor() {
    super(Restaurant)
  }

  findMenu = (req, res, next) => {
    Restaurant.findById(req.params.id, '+menu')
      .then((restaurant) => {
        if (!restaurant) {
          throw new NotFoundError('Restaurant Not Found')
        } else {
          res.json(restaurant.menu)
          return next()
        }
      })
      .catch(next)
  }

  replaceMenu = (req, res, next) => {
    Restaurant.findById(req.params.id)
      .then((restaurant) => {
        if (!restaurant) {
          throw new NotFoundError('Restaurant Not Found')
        } else {
          restaurant.menu = req.body
          return restaurant.save()
        }
      })
      .then((response) => {
        res.json(response.menu)
        return next()
      })
      .catch(next)
  }

  applyRoutes(application: restify.Server) {
    application.get('/restaurants', this.findAll)

    application.get('/restaurants/:id', [this.validateId, this.findById])

    application.post('/restaurants', this.save)

    application.put('/restaurants/:id', [this.validateId, this.replace])

    application.patch('/restaurants/:id', [this.validateId, this.update])

    application.del('/restaurants/:id', [this.validateId, this.delete])

    application.get('/restaurants/:id/menu', [this.validateId, this.findMenu])

    application.put('/restaurants/:id/menu', [
      this.validateId,
      this.replaceMenu,
    ])
  }
}

export const restaurantsRouter = new RestaurantsRouter()
