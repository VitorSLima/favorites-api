import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'
import { registerValidator, loginValidator } from '#validators/auth'
import { errors } from '@vinejs/vine'

export default class AuthController {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Register a new user
   *     description: Creates a new user account.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 example: john.doe@example.com
   *               password:
   *                 type: string
   *                 example: secret123
   *     responses:
   *       '201':
   *         description: User created successfully
   *       '409':
   *         description: Email already in use
   *       '422':
   *         description: Validation error
   */
  public async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      const exists = await User.query().where('email', payload.email).first()
      if (exists) return response.conflict({ message: 'Email already in use' })

      const user = await User.create({
        name: payload.name,
        email: payload.email,
        password: payload.password,
      })

      return response.created({ id: user.id, name: user.name, email: user.email })
    } catch (err) {
      if (err instanceof errors.E_VALIDATION_ERROR) {
        return response.badRequest({ errors: err.messages })
      }
      throw err
    }
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Login a user
   *     description: Authenticates a user and returns a JWT token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: john.doe@example.com
   *               password:
   *                 type: string
   *                 example: secret123
   *     responses:
   *       '200':
   *         description: Login successful
   *       '401':
   *         description: Invalid credentials
   *       '422':
   *         description: Validation error
   */

  public async login({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)
      const token = await auth.use('api').createToken(user, ['*'], { expiresIn: '7 days' })
      return response.ok({
        type: 'bearer',
        token: token.value!.release(),
        expiresAt: token.expiresAt,
      })
    } catch {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
  }
}
