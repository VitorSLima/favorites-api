import type { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'
import { createCustomerValidator, updateCustomerValidator } from '#validators/customer'
import { errors } from '@vinejs/vine'

export default class CustomersController {
  public async findAll({}: HttpContext) {
    const customers = await Customer.query().orderBy('id', 'desc')
    return customers
  }

  public async findById({ params, response }: HttpContext) {
    const customer = await Customer.find(params.id)
    if (!customer) return response.notFound()
    return customer
  }

  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createCustomerValidator)
      const exists = await Customer.query().where('email', payload.email).first()
      if (exists) return response.conflict({ message: 'Email already in use' })
      const customer = await Customer.create(payload)
      return response.created(customer)
    } catch (err) {
      if (err instanceof errors.E_VALIDATION_ERROR) {
        return response.badRequest({ errors: err.messages })
      }
      throw err
    }
  }

  public async update({ params, request, response }: HttpContext) {
    const customer = await Customer.find(params.id)
    if (!customer) return response.notFound()

    const payload = await request.validateUsing(updateCustomerValidator)
    if (payload.email) {
      const emailInUse = await Customer.query()
        .where('email', payload.email)
        .whereNot('id', params.id)
        .first()
      if (emailInUse) return response.conflict({ message: 'Email already in use' })
    }

    customer.merge(payload)
    await customer.save()
    return customer
  }

  public async delete({ params, response }: HttpContext) {
    const customer = await Customer.find(params.id)
    if (!customer) return response.notFound()
    await customer.delete()
    return response.noContent()
  }
}
