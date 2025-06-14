import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useAppSelector'; // Adjust import path as needed

interface UserGoalProgress {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  goals: {
    type: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    progress: number;
  }[];
}

const AdminProgressTracking: React.FC = () => {
  const [userProgressData, setUserProgressData] = useState<UserGoalProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAppSelector(state => state.auth); // Access token from Redux state

  useEffect(() => {
    fetchUserProgress();
  }, [token]); // Refetch if token changes

  const fetchUserProgress = async () => {
    if (!token) {
      setError('Authentication token not available.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Assuming you have an admin route like /api/goals/all-goals
      const response = await axios.get('/api/goals/all-goals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserProgressData(response.data.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching user progress:', error);
      setError(error.response?.data?.message || 'Failed to fetch user progress');
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>User Progress Tracking</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : userProgressData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>User Email</TableCell>
                <TableCell>Goals</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userProgressData.map((userData) => (
                <TableRow key={userData._id}>
                  <TableCell>{userData.userId?.name || 'N/A'}</TableCell>
                  <TableCell>{userData.userId?.email || 'N/A'}</TableCell>
                  <TableCell>
                    {userData.goals.length > 0 ? (
                      <ul>
                        {userData.goals.map((goal, index) => (
                          <li key={index}>
                            <strong>{goal.type}:</strong> {goal.description} ({goal.progress}% - {goal.status})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'No goals set'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary">No user progress data available.</Typography>
      )}
    </Box>
  );
};

export default AdminProgressTracking; 