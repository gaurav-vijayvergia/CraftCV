import express from 'express';
import { createCV, getCVsByUserId, updateCVStatus } from '../models/cv';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { originalFilename, fileUrl } = req.body;
    const cv = await createCV(req.user!.id, originalFilename, fileUrl);
    res.json(cv);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create CV' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const cvs = await getCVsByUserId(req.user!.id);
    res.json(cvs);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch CVs' });
  }
});

router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await updateCVStatus(id, status);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update CV status' });
  }
});

export default router;