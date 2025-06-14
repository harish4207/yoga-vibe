import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  PlayCircleOutline as PlayIcon,
  Article as ArticleIcon,
  EventNote as LiveClassIcon,
  FavoriteBorder as BookmarkIcon,
  Add as AddIcon,
  Edit as EditIcon,
  DateRange as DateRangeIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  FitnessCenter as FitnessCenterIcon,
  EmojiEvents as GoalsIcon,
  TrendingUp as ProgressIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/useAppSelector';
import { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { getProfile } from '../store/slices/authSlice';
import type { RootState } from '../store';
import type { AuthState } from '../store/slices/authSlice';
import { User, YogaClass, Instructor } from '../types/index'; // Corrected import
import { toast } from 'react-toastify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import UserContent from '../components/dashboard/UserContent';
import { useTheme } from '@mui/material/styles';

// Constants
const yogaLevels = ['beginner', 'intermediate', 'advanced'];

// Types
interface AppState {
  auth: AuthState;
}

const Dashboard: React.FC = () => {
  const { user, token, isAuthenticated, loading, error } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  // State for user profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState<User>({
    _id: user?._id || '',
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    profilePicture: user?.profilePicture || '',
    avatar: user?.avatar || user?.profilePicture || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    yogaLevel: user?.yogaLevel || '',
    enrolledClasses: user?.enrolledClasses || [],
    teachingClasses: user?.teachingClasses || [],
    createdAt: user?.createdAt || new Date(),
    updatedAt: user?.updatedAt || new Date(),
  });

  // State for goals management (keep existing goals logic)
  const [goals, setGoals] = useState<any>(null); // This should be properly typed based on your goals schema
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: '',
    description: '',
    targetDate: '',
  });

  // State for subscription (keep existing subscription logic)
  const [subscription, setSubscription] = useState<any>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  // Fetch user profile on component mount if not already loaded
  useEffect(() => {
    if (isAuthenticated && !user && !loading) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, user, loading, dispatch]);

  // Update profile form data when user state changes
  useEffect(() => {
    if (user) {
      setProfileFormData({
        _id: user._id || '',
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        profilePicture: user.profilePicture || '',
        avatar: user.avatar || user.profilePicture || '',
        phone: user.phone || '',
        bio: user.bio || '',
        yogaLevel: user.yogaLevel || '',
        enrolledClasses: user.enrolledClasses || [],
        teachingClasses: user.teachingClasses || [],
        createdAt: user.createdAt || new Date(),
        updatedAt: user.updatedAt || new Date(),
      });
      // Also fetch goals and subscription if user is available
      fetchGoals();
      fetchSubscription();
    }
  }, [user, token]); // Added token to dependencies

  const fetchGoals = async () => {
    if (!token) return;
    try {
      const response = await axios.get('/api/goals/my-goals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGoals(response.data.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const fetchSubscription = async () => {
    if (!token) return;
    try {
      const response = await axios.get('/api/subscriptions/my-subscription', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubscription(response.data.data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const handleAddGoal = async () => {
    if (!token) return;
    try {
      await axios.put('/api/goals/my-goals', {
        ...goals,
        goals: [...(goals?.goals || []), { ...newGoal, status: 'pending', progress: 0 }],
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewGoal({ type: '', description: '', targetDate: '',});
      fetchGoals();
      toast.success('Goal added successfully!');
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error('Failed to add goal.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setProfileFormData((prev: User) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!token || !user?._id) return;
    try {
      await axios.put(`/api/users/${user._id}`, profileFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(getProfile()); // Refresh profile data
      setIsEditingProfile(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile.');
    }
  };

  if (loading || !user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error" align="center">Error: {error}</Typography>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography align="center">Please log in to view your dashboard.</Typography>
      </Container>
    );
  }

  const upcomingClasses = (user.enrolledClasses || []).filter((cls: YogaClass) => new Date(cls.date) > new Date()).sort((a: YogaClass, b: YogaClass) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate progress metrics
  const totalClassesAttended = (user.enrolledClasses || []).filter((cls: YogaClass) => new Date(cls.date) <= new Date()).length;
  const currentYogaLevel = user.yogaLevel || 'Not set';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, py: 4, position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1,
          bgcolor: 'rgba(255, 255, 255, 0.7)', // Lighter background for better contrast on dashboard
          borderRadius: '50%',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            bgcolor: theme.palette.primary.light,
          },
        }}
      >
        <IconButton onClick={() => navigate(-1)} color="inherit" sx={{ color: theme.palette.text.primary }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Grid container spacing={4}>
        {/* Welcome and Quick Actions */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Welcome, {user.name}!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Ready for your next yoga session? Check your upcoming classes or explore new ones.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<FitnessCenterIcon />}
                sx={{ bgcolor: '#F6E05E', color: '#1A202C', '&:hover': { bgcolor: '#C0A14F' } }}
                component={RouterLink}
                to="/classes"
              >
                Explore Classes
              </Button>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                onClick={() => setIsEditingProfile(true)}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                startIcon={<ProgressIcon />}
                sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                component={RouterLink}
                to="/progress-stats"
              >
                View Progress
              </Button>
              <Button
                variant="outlined"
                startIcon={<GoalsIcon />}
                sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                onClick={() => setIsEditingGoals(true)}
              >
                Set Goals
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Upcoming Classes */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Upcoming Classes
            </Typography>
            {upcomingClasses.length > 0 ? (
              <List>
                {upcomingClasses.map((cls: YogaClass) => (
                  <ListItem key={cls._id} divider>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          {cls.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Chip label={cls.style} size="small" sx={{ mr: 1, bgcolor: '#EBF8FF', color: '#2B6CB0' }} />
                          <Chip label={cls.level} size="small" sx={{ mr: 1, bgcolor: '#E6FFFA', color: '#38A169' }} />
                          <Chip label={`${cls.duration} min`} size="small" sx={{ bgcolor: '#FEEBC8', color: '#DD6B20' }} />
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <DateRangeIcon sx={{ mr: 0.5, fontSize: 'inherit' }} />
                            {new Date(cls.date).toLocaleDateString()} at {new Date(cls.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon sx={{ mr: 0.5, fontSize: 'inherit' }} />
                            {cls.location?.type === 'online' ? `Online: ${cls.location.meetingLink}` : `In-Person: ${cls.location?.address}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 0.5, fontSize: 'inherit' }} />
                            Instructor: {typeof cls.instructor === 'string' ? cls.instructor : cls.instructor?.name}
                          </Typography>
                        </Box>
                      }
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      component={RouterLink}
                      to={`/classes/${cls._id}`}
                    >
                      View Details
                    </Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                You don't have any upcoming classes. <Button component={RouterLink} to="/classes">Explore Classes</Button>
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Progress Overview */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Your Progress
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">Total Classes Attended: <Typography component="span" fontWeight="bold">{totalClassesAttended}</Typography></Typography>
              <Typography variant="body1">Current Yoga Level: <Typography component="span" fontWeight="bold">{currentYogaLevel}</Typography></Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ProgressIcon />}
              fullWidth
              component={RouterLink}
              to="/progress-stats"
            >
              Detailed Stats
            </Button>
          </Paper>
        </Grid>

        {/* Profile Details - Toggleable Edit */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 0 }}>
                Profile Information
              </Typography>
              {!isEditingProfile && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditingProfile(true)}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
            {isEditingProfile ? (
              <Box>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={profileFormData.name}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profileFormData.email}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  disabled
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={profileFormData.phone || ''}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={3}
                  value={profileFormData.bio || ''}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Yoga Level</InputLabel>
                  <Select
                    name="yogaLevel"
                    value={profileFormData.yogaLevel || ''}
                    onChange={handleChange}
                    label="Yoga Level"
                  >
                    {yogaLevels.map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button variant="contained" onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                  <Button variant="outlined" onClick={() => setIsEditingProfile(false)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1"><strong>Name:</strong> {user.name}</Typography>
                <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
                {user.phone && <Typography variant="body1"><strong>Phone:</strong> {user.phone}</Typography>}
                {user.bio && <Typography variant="body1"><strong>Bio:</strong> {user.bio}</Typography>}
                {user.yogaLevel && <Typography variant="body1"><strong>Yoga Level:</strong> {user.yogaLevel}</Typography>}
                <Typography variant="body1"><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Goals Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 0 }}>
                Your Goals
              </Typography>
              {!isEditingGoals && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setIsEditingGoals(true)}
                >
                  Add/Edit Goals
                </Button>
              )}
            </Box>
            {isEditingGoals ? (
              <Box>
                <TextField
                  fullWidth
                  label="Goal Type"
                  name="type"
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Target Date"
                  type="date"
                  name="targetDate"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={handleAddGoal} sx={{ mr: 2 }}>
                  Add Goal
                </Button>
                <Button variant="outlined" onClick={() => setIsEditingGoals(false)}>
                  Done
                </Button>
                {goals?.goals && goals.goals.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Current Goals:</Typography>
                    <List>
                      {goals.goals.map((goal: any, index: number) => (
                        <ListItem key={index} divider>
                          <ListItemText
                            primary={goal.type}
                            secondary={`${goal.description} (Target: ${new Date(goal.targetDate).toLocaleDateString()}) - Status: ${goal.status}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            ) : (goals?.goals && goals.goals.length > 0) ? (
              <List>
                {goals.goals.map((goal: any, index: number) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={goal.type}
                      secondary={`${goal.description} (Target: ${new Date(goal.targetDate).toLocaleDateString()}) - Status: ${goal.status}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">No goals set yet. Click "Add/Edit Goals" to set your aspirations!</Typography>
            )}
          </Paper>
        </Grid>

        {/* Subscription Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Your Subscription
            </Typography>
            {loadingSubscription ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size={20} /></Box>
            ) : subscription ? (
              <Box>
                <Typography variant="body1"><strong>Plan:</strong> {subscription.planName}</Typography>
                <Typography variant="body1"><strong>Status:</strong> {subscription.status}</Typography>
                <Typography variant="body1"><strong>Expires On:</strong> {new Date(subscription.endDate).toLocaleDateString()}</Typography>
                <Button variant="contained" sx={{ mt: 2 }} component={RouterLink} to="/subscription-plans">
                  Manage Subscription
                </Button>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                You don't have an active subscription. <Button component={RouterLink} to="/pricing">View Plans</Button>
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Additional Resources (New Column) */}
        <Grid item xs={12}>
          <UserContent />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
