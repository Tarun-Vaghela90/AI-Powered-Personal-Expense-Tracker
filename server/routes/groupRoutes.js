import express from 'express';
import {
  createGroup,joinGroup, getShareCode, leaveGroup, getGroupInfo , getUserGroups } from '../controller/groupController.js';
import { fetchuser } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Create a new group
router.post('/create', fetchuser, createGroup);

// ✅ Join a group by ID
router.post('/join/:groupId', fetchuser, joinGroup);
router.get('/join/:groupId', fetchuser, joinGroup);

// ✅ Get share link for a specific group
router.get('/share-code/:groupId', fetchuser, getShareCode);

// ✅ Leave a specific group
router.delete('/leave/:groupId', fetchuser, leaveGroup);

// ✅ Get group info by ID
router.get('/info/:groupId', fetchuser, getGroupInfo);
router.get('/my-groups', fetchuser, getUserGroups);


export default router;
