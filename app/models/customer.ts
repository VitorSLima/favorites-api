import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Favorite from './favorite.js'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @hasMany(() => Favorite)
  declare favorites: HasMany<typeof Favorite>
}
