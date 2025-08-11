import type { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'
import { createCustomerValidator, updateCustomerValidator } from '#validators/customer'
import { errors } from '@vinejs/vine'

export default class CustomersController {
  /**
   * @swagger
   * /customers:
   *   get:
   *     tags:
   *       - Customers
   *     summary: List all customers
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: A list of customers
   *       '401':
   *         description: Unauthorized
   */
  public async findAll({}: HttpContext) {
    const customers = await Customer.query().orderBy('id', 'desc')
    return customers
  }

  /**
   * @swagger
   * /customers/{id}:
   *   get:
   *     tags:
   *       - Customers
   *     summary: Find a customer by ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       '200':
   *         description: The customer object
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Customer not found
   */
  public async findById({ params, response }: HttpContext) {
    const customer = await Customer.find(params.id)
    if (!customer) return response.notFound()
    return customer
  }

  /**
   * @swagger
   * /customers:
   *   post:
   *     tags:
   *       - Customers
   *     summary: Create a new customer
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: Jane Doe
   *               email:
   *                 type: string
   *                 example: jane.doe@example.com
   *     responses:
   *       '201':
   *         description: Customer created successfully
   *       '401':
   *         description: Unauthorized
   *       '409':
   *         description: Email already in use
   *       '422':
   *         description: Validation error
   */
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

  /**
   * @swagger
   * /customers/{id}:
   *   put:
   *     tags:
   *       - Customers
   *     summary: Update a customer
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
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
   *               name:
   *                 type: string
   *                 example: Jane Doe Updated
   *               email:
   *                 type: string
   *                 example: jane.doe.updated@example.com
   *     responses:
   *       '200':
   *         description: Customer updated successfully
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Customer not found
   *       '409':
   *         description: Email already in use by another customer
   *       '422':
   *         description: Validation error
   */
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

  /**
   * @swagger
   * /customers/{id}:
   *   delete:
   *     tags:
   *       - Customers
   *     summary: Delete a customer
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       '204':
   *         description: Customer deleted successfully
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Customer not found
   */
  public async delete({ params, response }: HttpContext) {
    const customer = await Customer.find(params.id)
    if (!customer) return response.notFound()
    await customer.delete()
    return response.noContent()
  }
}
