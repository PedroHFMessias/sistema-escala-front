import { Router } from 'express';

import { createUser, deleteUser, getUser, listUsers, updateUser } from '../controllers/usersController';

const router = Router();

router.get('/', listUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
