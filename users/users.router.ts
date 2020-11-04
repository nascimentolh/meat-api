import * as restify from 'restify'
import { User, UserDocument } from './users.model'
import { ModelRouter } from '../common/model-router'

class UsersRouter extends ModelRouter<UserDocument> {
  constructor() {
    super(User)
    this.on('beforeRender', (document) => {
      document.password = undefined
    })
  }

  applyRoutes(application: restify.Server) {
    application.get(`${this.basePath}`, this.findAll)

    application.get(`${this.basePath}/:id`, [this.validateId, this.findById])

    application.post(`${this.basePath}`, this.save)

    application.put(`${this.basePath}/:id`, [this.validateId, this.replace])

    application.patch(`${this.basePath}/:id`, [this.validateId, this.update])

    application.del(`${this.basePath}/:id`, [this.validateId, this.delete])
  }
}

export const usersRouter = new UsersRouter()
