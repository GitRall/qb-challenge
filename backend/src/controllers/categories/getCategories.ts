import { Request, Response, NextFunction } from 'express'
import prisma from '../../database/prismaClient'
import * as z from 'zod'


export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany()

    res.json({
      categories
    })
  } catch (error) {
    next(error)
  }
}
