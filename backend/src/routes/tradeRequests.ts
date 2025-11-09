import { Router } from 'express';

import {
  createTradeRequest,
  listTradeRequests,
  updateTradeRequestStatus,
} from '../controllers/tradeRequestsController';

const router = Router();

router.get('/', listTradeRequests);
router.post('/', createTradeRequest);
router.put('/:id/status', updateTradeRequestStatus);

export default router;
