import { NextFunction, Request, Response } from 'express'
import prisma from '../../database/prismaClient'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.$queryRaw`SELECT 1+1`
    res.json({ status: 'ok' })
  } catch (error) {
    next(error)
  }
}
