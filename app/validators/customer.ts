import vine from '@vinejs/vine'

export const createCustomerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2),
    email: vine.string().trim().email(),
  })
)

export const updateCustomerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).optional(),
    email: vine.string().trim().email().optional(),
  })
)
