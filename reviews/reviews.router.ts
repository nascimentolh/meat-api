import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { Review, ReviewDocument } from './reviews.model'
import { ModelRouter } from '../common/model-router'

class ReviewsRouter extends ModelRouter<ReviewDocument> {
  constructor() {
    super(Review)
  }

  protected prepareOne(
    query: mongoose.DocumentQuery<ReviewDocument, ReviewDocument>
  ): mongoose.DocumentQuery<ReviewDocument, ReviewDocument> {
    return query.populate('user', 'name').populate('restaurant', 'name')
  }

  applyRoutes(application: restify.Server) {
    application.get('/reviews', this.findAll)

    application.get('/reviews/:id', [this.validateId, this.findById])

    application.post('/reviews', this.save)
  }
}

export const reviewsRouter = new ReviewsRouter()
