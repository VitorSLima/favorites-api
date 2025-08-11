import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/http/auth.controller')
const CustomersController = () => import('#controllers/http/customer.controller')
const FavoritesController = () => import('#controllers/http/favorites.controller')

router.post('/auth/register', [AuthController, 'register'])
router.post('/auth/login', [AuthController, 'login'])

router
  .group(() => {
    router.get('/customers', [CustomersController, 'findAll'])
    router.get('/customers/:id', [CustomersController, 'findById'])
    router.post('/customers', [CustomersController, 'store'])
    router.put('/customers/:id', [CustomersController, 'update'])
    router.delete('/customers/:id', [CustomersController, 'delete'])

    router.get('/customers/:customerId/favorites', [FavoritesController, 'findAll'])
    router.post('/customers/:customerId/favorites', [FavoritesController, 'add'])
    router.delete('/customers/:customerId/favorites/:productId', [FavoritesController, 'delete'])
  })
  .use(middleware.auth())
