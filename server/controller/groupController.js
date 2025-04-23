import Group from '../model/groupModel.js';
import crypto from 'crypto';


export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Group name is required' });
    }

    // Create the new group
    const newGroup = new Group({
      name,
      owner: req.user.id,
      members: [req.user.id] // Owner is also the first member
    });

    await newGroup.save();

    // Generate share link
    const shareLink = `${req.protocol}://${req.get('host')}/api/group/join/${newGroup._id}`;

    res.status(201).json({
      message: 'Group created successfully',
      group: newGroup,
      shareLink
    });
  } catch (err) {
    console.error('Create Group Error:', err.message);
    res.status(500).json({ message: 'Error creating group', error: err.message });
  }
};


  
  // ✅ JOIN GROUP
  export const joinGroup = async (req, res) => {
    try {
      const group = await Group.findById(req.params.groupId);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
  
      if (group.members.includes(req.user.id)) {
        return res.status(400).json({ error: 'You are already a member of this group' });
      }
  
      group.members.push(req.user.id);
      await group.save();
  
      res.json({ success: true, message: 'Joined group successfully', group });
    } catch (err) {
      console.error('Join Group Error:', err.message);
      res.status(500).send('Server Error');
    }
  };
  
  // ✅ GET SHARE LINK
  export const getShareCode = async (req, res) => {
    try {
      const group = await Group.findById(req.params.groupId);  // Find the group by ID from the route param
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });  // Return error if the group is not found
      }
  
      // Only the owner of the group can generate the share code
      if (group.owner.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Only group owner can get share code' }); // Unauthorized if not owner
      }
  
      // Generate a random share code using crypto
      const shareCode = crypto.randomBytes(6).toString('hex');  // Generates a 12-character share code
  
      // Optionally, you could store the share code in the group document or database for validation later
      group.shareCode = shareCode;
      await group.save();
  
      res.json({ success: true, shareCode });  // Send the generated share code to the frontend
    } catch (err) {
      console.error('Get Share Code Error:', err.message);  // Log the error
      res.status(500).send('Server Error');  // Send server error if an issue occurs
    }
  };
  
  // ✅ LEAVE GROUP
  export const leaveGroup = async (req, res) => {
    try {
      const group = await Group.findById(req.params.groupId);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
  
      // If owner tries to leave
      if (group.owner.toString() === req.user.id) {
        return res.status(403).json({ error: "Group owner can't leave the group" });
      }
  
      const memberIndex = group.members.indexOf(req.user.id);
      if (memberIndex === -1) {
        return res.status(400).json({ error: 'You are not a member of this group' });
      }
  
      group.members.splice(memberIndex, 1);
      await group.save();
  
      res.json({ success: true, message: 'You left the group' });
    } catch (err) {
      console.error('Leave Group Error:', err.message);
      res.status(500).send('Server Error');
    }
  };
  
  // ✅ GET GROUP INFO (including member details)
  export const getGroupInfo = async (req, res) => {
    try {
      const group = await Group.findById(req.params.groupId)
        .populate('owner', 'name email')
        .populate('members', 'name email');
  
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
  
      // Must be a member to access group info
      if (!group.members.some(member => member._id.toString() === req.user.id)) {
        return res.status(403).json({ error: 'You are not a member of this group' });
      }
  
      res.json({ success: true, group });
    } catch (err) {
      console.error('Get Group Info Error:', err.message);
      res.status(500).send('Server Error');
    }
  };
  export const getUserGroups = async (req, res) => {
    try {
      const groups = await Group.find({ members: req.user.id });
  
      res.status(200).json({
        success: true,
        groups,
      });
    } catch (error) {
      console.error('Error fetching user groups:', error);
      res.status(500).json({ message: 'Server error while fetching user groups' });
    }
  };