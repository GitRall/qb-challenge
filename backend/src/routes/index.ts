import healthRoutes from './healthRoutes'
import productsRoutes from './productsRoutes'

export default {
  global: [healthRoutes], // Global routes that is appended to root
  apiV1: [productsRoutes], // routes that is appended to /api/v1
}
