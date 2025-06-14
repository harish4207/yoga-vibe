import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useAppSelector';
import { Payment } from '../../types'; // Assuming Payment interface is defined here

const AdminPaymentHistory: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  useEffect(() => {
    fetchPaymentHistory();
  }, [token]);

  const fetchPaymentHistory = async () => {
    if (!token) {
      setSnackbarSeverity('warning');
      setSnackbarMessage('Authentication token not found. Please log in.');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get('/api/payments/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayments(response.data.data);
    } catch (error: any) {
      setSnackbarSeverity('error');
      setSnackbarMessage(error.response?.data?.message || 'Failed to fetch payment history');
      setSnackbarOpen(true);
      console.error('Error fetching payment history:', error);
    }
    setLoading(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Payment History</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : payments.length === 0 ? (
        <Typography>No payment records found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell>User Email</TableCell>
                <TableCell>Class Title</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment._id}</TableCell>
                  <TableCell>{payment.user?.email || 'N/A'}</TableCell>
                  <TableCell>{payment.class?.title || payment.description || 'N/A'}</TableCell>
                  <TableCell>₹{payment.amount}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPaymentHistory; 