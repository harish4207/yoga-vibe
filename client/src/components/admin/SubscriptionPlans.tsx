import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useAppSelector';

interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  billingCycle: 'monthly' | 'yearly';
  features: {
    maxLiveSessions: number;
    maxOnDemandContent: number;
    hasCommunityAccess: boolean;
    hasPersonalizedPlan: boolean;
    hasProgressTracking: boolean;
    hasChallengesAccess: boolean;
  };
  isActive: boolean;
}

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<Partial<SubscriptionPlan>>({
    name: '',
    description: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    billingCycle: 'monthly',
    features: {
      maxLiveSessions: 0,
      maxOnDemandContent: 0,
      hasCommunityAccess: false,
      hasPersonalizedPlan: false,
      hasProgressTracking: false,
      hasChallengesAccess: false,
    },
    isActive: true,
  });

  const { token } = useAppSelector(state => state.auth);

  useEffect(() => {
    fetchPlans();
  }, [token]);

  const fetchPlans = async () => {
    if (!token) {
      console.error('Authentication token not available. Cannot fetch plans.');
      return;
    }
    try {
      const response = await axios.get('/api/subscriptions/plans', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlans(response.data.data);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };

  const handleOpenDialog = (plan?: SubscriptionPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData(plan);
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        monthlyPrice: 0,
        yearlyPrice: 0,
        billingCycle: 'monthly',
        features: {
          maxLiveSessions: 0,
          maxOnDemandContent: 0,
          hasCommunityAccess: false,
          hasPersonalizedPlan: false,
          hasProgressTracking: false,
          hasChallengesAccess: false,
        },
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlan(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('features.')) {
      const featureName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features!,
          [featureName]: type === 'checkbox' ? checked : Number(value),
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      console.error('Authentication token not available. Cannot save plan.');
      return;
    }
    try {
      if (editingPlan) {
        await axios.put(`/api/subscriptions/plans/${editingPlan._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post('/api/subscriptions/plans', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      fetchPlans();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving subscription plan:', error);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!token) {
      console.error('Authentication token not available. Cannot delete plan.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await axios.delete(`/api/subscriptions/plans/${planId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchPlans();
      } catch (error) {
        console.error('Error deleting subscription plan:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Subscription Plans</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add New Plan
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Monthly Price</TableCell>
              <TableCell>Yearly Price</TableCell>
              <TableCell>Billing Cycle</TableCell>
              <TableCell>Features</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan._id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell>₹{plan.monthlyPrice}</TableCell>
                <TableCell>₹{plan.yearlyPrice}</TableCell>
                <TableCell>{plan.billingCycle}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    • Live Sessions: {plan.features.maxLiveSessions}
                    <br />
                    • On-Demand Content: {plan.features.maxOnDemandContent}
                    <br />
                    • Community Access: {plan.features.hasCommunityAccess ? 'Yes' : 'No'}
                    <br />
                    • Personalized Plan: {plan.features.hasPersonalizedPlan ? 'Yes' : 'No'}
                  </Typography>
                </TableCell>
                <TableCell>{plan.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(plan)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(plan._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Plan Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Monthly Price"
                name="monthlyPrice"
                type="number"
                value={formData.monthlyPrice}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Yearly Price"
                name="yearlyPrice"
                type="number"
                value={formData.yearlyPrice}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Billing Cycle"
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleInputChange}
                SelectProps={{ native: true }}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Features</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max Live Sessions"
                name="features.maxLiveSessions"
                type="number"
                value={formData.features?.maxLiveSessions}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max On-Demand Content"
                name="features.maxOnDemandContent"
                type="number"
                value={formData.features?.maxOnDemandContent}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.features?.hasCommunityAccess}
                    onChange={handleInputChange}
                    name="features.hasCommunityAccess"
                  />
                }
                label="Community Access"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.features?.hasPersonalizedPlan}
                    onChange={handleInputChange}
                    name="features.hasPersonalizedPlan"
                  />
                }
                label="Personalized Plan"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.features?.hasProgressTracking}
                    onChange={handleInputChange}
                    name="features.hasProgressTracking"
                  />
                }
                label="Progress Tracking"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.features?.hasChallengesAccess}
                    onChange={handleInputChange}
                    name="features.hasChallengesAccess"
                  />
                }
                label="Challenges Access"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    name="isActive"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPlan ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionPlans; 