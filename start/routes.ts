import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/http/auth.controller')
const CustomersController = () => import('#controllers/http/customer.controller')
const FavoritesController = () => import('#controllers/http/favorites.controller')

router.post('/auth/register', [AuthController, 'register'])
router.post('/auth/login', [AuthController, 'login'])

router
  .group(() => {
    router.get('/customers', [CustomersController, 'index'])
    router.get('/customers/:id', [CustomersController, 'show'])
    router.post('/customers', [CustomersController, 'store'])
    router.put('/customers/:id', [CustomersController, 'update'])
    router.delete('/customers/:id', [CustomersController, 'destroy'])

    router.get('/customers/:customerId/favorites', [FavoritesController, 'list'])
    router.post('/customers/:customerId/favorites', [FavoritesController, 'add'])
    router.delete('/customers/:customerId/favorites/:productId', [FavoritesController, 'remove'])
  })
  .use(middleware.auth())
