import { Request, Response, NextFunction } from 'express'
import prisma from '../../database/prismaClient'
import * as z from 'zod'

const bodySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).default(10),
})

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validating req body/params
    const body = bodySchema.parse({
      page: req.query.page,
      limit: req.query.limit,
    })

    const page: number = body.page as number
    const limit: number = body.limit as number
    const offset = (page - 1) * limit

    // Parallel fetching of data from database
    const [total, rows] = await Promise.all([
      // Get total count for pagination metadata
      prisma.product.count(),
      // Get paginated products
      prisma.product.findMany({
        skip: offset,
        take: limit,
        include: {
          category: true
        }
      }),
    ])

    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    res.json({
      products: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    })
  } catch (error) {
    next(error)
  }
}
