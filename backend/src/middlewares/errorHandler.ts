import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  if (error instanceof Error) {
    if ('code' in error) {
      const prismaCode = (error as { code?: string }).code;

      if (prismaCode === 'P2002') {
        return res.status(409).json({ success: false, message: 'Registro duplicado' });
      }

      if (prismaCode === 'P2025') {
        return res.status(404).json({ success: false, message: 'Registro não encontrado' });
      }
    }

    return res.status(500).json({ success: false, message: error.message });
  }

  return res.status(500).json({ success: false, message: 'Erro desconhecido' });
};
