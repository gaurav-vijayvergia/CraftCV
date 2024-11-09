import express from 'express';
import {
  getOrganization,
  updateOrganization,
} from '../models/organization';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const organization = await getOrganization(req.user!.id);
    res.json(organization);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch organization' });
  }
});

router.patch('/', authenticateToken, async (req, res) => {
  try {
    await updateOrganization(req.user!.id, req.body);
    const organization = await getOrganization(req.user!.id);
    res.json(organization);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update organization' });
  }
});

export default router;