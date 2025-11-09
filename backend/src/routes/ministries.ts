import { Router } from 'express';

import {
  createMinistry,
  deleteMinistry,
  getMinistry,
  listMinistries,
  updateMinistry,
} from '../controllers/ministriesController';

const router = Router();

router.get('/', listMinistries);
router.get('/:id', getMinistry);
router.post('/', createMinistry);
router.put('/:id', updateMinistry);
router.delete('/:id', deleteMinistry);

export default router;
