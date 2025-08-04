import healthRoutes from './healthRoutes'
import productsRoutes from './productsRoutes'
import categoriesRoutes from './categoriesRoutes'

export default {
  global: [healthRoutes], // Global routes that is appended to root
  apiV1: [productsRoutes, categoriesRoutes], // routes that is appended to /api/v1
}
