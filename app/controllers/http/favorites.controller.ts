import type { HttpContext } from '@adonisjs/core/http'
import Favorite from '#models/favorite'
import Customer from '#models/customer'
import { addFavoriteValidator } from '#validators/favorite'
import { errors } from '@vinejs/vine'
import FakeStoreService from '../../services/fake_store.service.js'

export default class FavoritesController {
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
