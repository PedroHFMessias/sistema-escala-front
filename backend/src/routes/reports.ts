import { Router } from 'express';

import { generateReport, listReports } from '../controllers/reportsController';

const router = Router();

router.get('/', listReports);
router.post('/', generateReport);

export default router;
