import { Router } from 'express';

import ministriesRouter from './ministries';
import reportsRouter from './reports';
import schedulesRouter from './schedules';
import tradeRequestsRouter from './tradeRequests';
import usersRouter from './users';

const router = Router();

router.use('/users', usersRouter);
router.use('/ministries', ministriesRouter);
router.use('/schedules', schedulesRouter);
router.use('/trade-requests', tradeRequestsRouter);
router.use('/reports', reportsRouter);

export default router;
