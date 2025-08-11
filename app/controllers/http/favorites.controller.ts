import type { HttpContext } from '@adonisjs/core/http'
import Favorite from '#models/favorite'
import Customer from '#models/customer'
import { addFavoriteValidator } from '#validators/favorite'
import { errors } from '@vinejs/vine'
import FakeStoreService from '../../services/fake_store.service.js'

export default class FavoritesController {
  /**
   * @swagger
   * /customers/{customerId}/favorites:
   *   get:
   *     tags:
   *       - Favorites
   *     summary: List all favorite products for a customer
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: customerId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       '200':
   *         description: A list of favorite products
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Customer not found
   */
  public async findAll({ params, response }: HttpContext) {
    const customer = await Customer.find(params.customerId)
    if (!customer) return response.notFound({ message: 'Customer not found' })

    const favorites = await Favorite.query().where('customer_id', customer.id)
    const data = await Promise.all(
      favorites.map(async (favorite) => {
        const p = await FakeStoreService.getById(favorite.productId)
        return p
          ? {
              id: p.id,
              title: p.title,
              image: p.image,
              price: p.price,
              review: p.rating ?? null,
            }
          : { id: favorite.productId }
      })
    )

    return data
  }

  /**
   * @swagger
   * /customers/{customerId}/favorites:
   *   post:
   *     tags:
   *       - Favorites
   *     summary: Add a favorite product to a customer
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: customerId
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               productId:
   *                 type: integer
   *                 example: 1
   *     responses:
   *       '201':
   *         description: Favorite added successfully
   *       '400':
   *         description: Invalid product
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Customer not found
   *       '409':
   *         description: Product already favorited
   *       '422':
   *         description: Validation error
   */
  public async add({ params, request, response }: HttpContext) {
    try {
      const customer = await Customer.find(params.customerId)
      if (!customer) return response.notFound({ message: 'Customer not found' })

      const { productId } = await request.validateUsing(addFavoriteValidator)

      const product = await FakeStoreService.getById(productId)
      if (!product) return response.badRequest({ message: 'Invalid product' })

      const existsFavorite = await Favorite.query()
        .where('customer_id', customer.id)
        .andWhere('product_id', productId)
        .first()

      if (existsFavorite) return response.conflict({ message: 'Already favorited' })

      await Favorite.create({ customerId: customer.id, productId })
      return response.created({
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        review: product.rating ?? null,
      })
    } catch (err) {
      if (err instanceof errors.E_VALIDATION_ERROR) {
        return response.badRequest({ errors: err.messages })
      }
      throw err
    }
  }

  /**
   * @swagger
   * /customers/{customerId}/favorites/{productId}:
   *   delete:
   *     tags:
   *       - Favorites
   *     summary: Remove a favorite product from a customer
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: customerId
   *         required: true
   *         schema:
   *           type: integer
   *       - in: path
   *         name: productId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       '204':
   *         description: Favorite removed successfully
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Customer or Favorite not found
   */
  public async delete({ params, response }: HttpContext) {
    const customer = await Customer.find(params.customerId)
    if (!customer) return response.notFound({ message: 'Customer not found' })

    const favorite = await Favorite.query()
      .where('customer_id', customer.id)
      .andWhere('product_id', Number(params.productId))
      .first()

    if (!favorite) return response.notFound({ message: 'Favorite not found' })

    await favorite.delete()
    return response.noContent()
  }
}
