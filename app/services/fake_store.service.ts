import axios from 'axios'
import env from '#start/env'

const api = axios.create({
  baseURL: env.get('FAKE_STORE_API_URL'),
  timeout: 8000,
})

export type FakeProduct = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating?: { rate: number; count: number }
}

export default class FakeStoreService {
  static async getById(id: number): Promise<FakeProduct | null> {
    try {
      const { data } = await api.get<FakeProduct>(`/products/${id}`)
      if (!data?.id) return null
      return data
    } catch {
      return null
    }
  }
}
