import * as mongoose from 'mongoose'
import * as restify from 'restify'
import { environment } from '../common/environment'
import { Router } from '../common/router'
import { handleError } from './error.handler'

export class Server {
  application: restify.Server

  initializeDb() {
    return mongoose.connect(environment.db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
  }

  initRoutes(routers: Router[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: 'meat-api',
          versions: ['1.0.0', '2.0.0'],
        })

        this.application.use(restify.plugins.queryParser())
        this.application.use(restify.plugins.bodyParser())

        //routes
        for (let router of routers) {
          router.applyRoutes(this.application)
        }

        this.application.listen(environment.server.port, () => {
          resolve(this.application)
        })

        this.application.on('restifyError', handleError)
      } catch (error) {
        reject(error)
      }
    })
  }
  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDb().then(() =>
      this.initRoutes(routers).then(() => this)
    )
  }
}
