import { Router } from 'express';

import {
  createSchedule,
  deleteSchedule,
  getSchedule,
  listSchedules,
  updateSchedule,
  updateScheduleVolunteerStatus,
} from '../controllers/schedulesController';

const router = Router();

router.get('/', listSchedules);
router.get('/:id', getSchedule);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);
router.put('/:scheduleId/volunteers/:volunteerId/status', updateScheduleVolunteerStatus);

export default router;
