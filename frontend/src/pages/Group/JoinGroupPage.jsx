// src/pages/JoinGroupPage.jsx

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JoinGroupPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const joinGroup = async () => {
      try {
        const token = localStorage.getItem('token'); // auth token
        if (!token) {
          alert("Please login to join the group.");
          return navigate('/login');
        }

        const res = await axios.post(
          `http://localhost:3001/api/group/join/${groupId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(res.data.message || 'Successfully joined the group!');
        navigate('/my-groups'); // or your dashboard
      } catch (error) {
        console.error('Join Group Error:', error);
        const msg = error.response?.data?.error || 'Failed to join group.';
        alert(msg);
        navigate('/');
      }
    };

    joinGroup();
  }, [groupId, navigate]);

  return <div>Joining group, please wait...</div>;
};

export default JoinGroupPage;
