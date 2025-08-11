import vine from '@vinejs/vine'

export const addFavoriteValidator = vine.compile(
  vine.object({
    productId: vine.number().positive(),
  })
)
