import { Env } from '@adonisjs/env'

export default await Env.create(new URL('../', import.meta.url), {
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  APP_KEY: Env.schema.string(),

  DB_CONNECTION: Env.schema.enum(['mysql'] as const),
  DB_HOST: Env.schema.string(),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),
})
