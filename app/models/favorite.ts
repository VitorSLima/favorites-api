import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Customer from './customer.js'

export default class Favorite extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare customerId: number

  @column()
  declare productId: number

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>
}
