import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'
import { registerValidator, loginValidator } from '#validators/auth'
import { errors } from '@vinejs/vine'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      const exists = await User.query().where('email', payload.email).first()
      if (exists) return response.conflict({ message: 'Email already in use' })

      const user = await User.create({
        name: payload.name,
        email: payload.email,
        password: await Hash.make(payload.password),
      })

      return response.created({ id: user.id, name: user.name, email: user.email })
    } catch (err) {
      if (err instanceof errors.E_VALIDATION_ERROR) {
        return response.badRequest({ errors: err.messages })
      }
      throw err
    }
  }

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
    } catch (err) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
  }
}
