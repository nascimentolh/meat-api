import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { Review, ReviewDocument } from './reviews.model'
import { ModelRouter } from '../common/model-router'

class ReviewsRouter extends ModelRouter<ReviewDocument> {
  constructor() {
    super(Review)
  }

  envelope(document) {
    let resource = super.envelope(document)
    const restId = document.restaurant._id
      ? document.restaurant._id
      : document.restaurant
    resource._links.restaurant = `/restaurants/${restId}`
    return resource
  }

  protected prepareOne(
    query: mongoose.DocumentQuery<ReviewDocument, ReviewDocument>
  ): mongoose.DocumentQuery<ReviewDocument, ReviewDocument> {
    return query.populate('user', 'name').populate('restaurant', 'name')
  }

  applyRoutes(application: restify.Server) {
    application.get(`${this.basePath}`, this.findAll)

    application.get(`${this.basePath}/:id`, [this.validateId, this.findById])

    application.post(`${this.basePath}`, this.save)
  }
}

export const reviewsRouter = new ReviewsRouter()
