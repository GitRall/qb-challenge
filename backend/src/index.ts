import express from 'express';
import routes from './routes'
import { errorHandler } from './middlewares/errorHandler'


const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Append all routes to app
app.use(routes.global)
app.use('/api/v1', routes.apiV1)

// Error handler middleware
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app