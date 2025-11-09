import { NextFunction, Request, Response } from 'express';

import { prisma } from '../config/prisma';
import { mapUserToResponse } from '../utils/mappers';
import { userTypeToFront, userTypeToPrisma } from '../utils/statusMapper';
import { createUserSchema, updateUserSchema } from '../validators/userValidator';

export const listUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        address: true,
        ministries: { include: { ministry: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: users.map(mapUserToResponse) });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        address: true,
        ministries: { include: { ministry: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    res.json({ success: true, data: mapUserToResponse(user) });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createUserSchema.parse(req.body);

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        cpf: payload.cpf,
        rg: payload.rg,
        password: payload.password,
        userType: userTypeToPrisma[payload.userType],
        address: payload.address
          ? {
              create: {
                street: payload.address.street,
                number: payload.address.number,
                complement: payload.address.complement,
                neighborhood: payload.address.neighborhood,
                city: payload.address.city,
                state: payload.address.state,
                zipCode: payload.address.zipCode,
              },
            }
          : undefined,
        ministries:
          payload.userType === 'volunteer'
            ? {
                create: payload.ministries.map((ministryId) => ({ ministryId })),
              }
            : undefined,
      },
      include: {
        address: true,
        ministries: { include: { ministry: true } },
      },
    });

    res.status(201).json({ success: true, data: mapUserToResponse(user) });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = updateUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { address: true },
    });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    const updatedUserType = payload.userType ?? userTypeToFront[existingUser.userType];

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        cpf: payload.cpf,
        rg: payload.rg,
        password: payload.password,
        userType: payload.userType ? userTypeToPrisma[payload.userType] : undefined,
        address: payload.address
          ? existingUser.address
            ? {
                update: {
                  street: payload.address.street,
                  number: payload.address.number,
                  complement: payload.address.complement,
                  neighborhood: payload.address.neighborhood,
                  city: payload.address.city,
                  state: payload.address.state,
                  zipCode: payload.address.zipCode,
                },
              }
            : {
                create: {
                  street: payload.address.street,
                  number: payload.address.number,
                  complement: payload.address.complement,
                  neighborhood: payload.address.neighborhood,
                  city: payload.address.city,
                  state: payload.address.state,
                  zipCode: payload.address.zipCode,
                },
              }
          : undefined,
        ministries:
          payload.ministries && updatedUserType === 'volunteer'
            ? {
                deleteMany: { volunteerId: req.params.id },
                create: payload.ministries.map((ministryId) => ({ ministryId })),
              }
            : payload.ministries && updatedUserType !== 'volunteer'
            ? { deleteMany: { volunteerId: req.params.id } }
            : undefined,
      },
      include: {
        address: true,
        ministries: { include: { ministry: true } },
      },
    });

    res.json({ success: true, data: mapUserToResponse(user) });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
