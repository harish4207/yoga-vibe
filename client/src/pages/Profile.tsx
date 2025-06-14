import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    Paper,
    TextField,
    Avatar,
    CircularProgress,
    IconButton,
} from '@mui/material';
import {
    FitnessCenter,
    CalendarToday,
    Star,
    AccountCircle as AccountCircleIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Description as DescriptionIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, uploadProfilePicture } from '../store/slices/authSlice';
import type { RootState } from '../store';
import { User, ProfileFormData } from '../types';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import { toast } from 'react-toastify';
import { AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Profile: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.auth);
    const [tabValue, setTabValue] = useState(0);
    const [formData, setFormData] = useState<ProfileFormData>({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
    });
    const [localProfilePicture, setLocalProfilePicture] = useState<string | undefined>(user?.profilePicture || user?.avatar);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
            });
            setLocalProfilePicture(user.profilePicture || user.avatar);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: ProfileFormData) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(updateProfile(formData));
            if (updateProfile.fulfilled.match(resultAction)) {
                toast.success('Profile updated successfully!');
            } else {
                let errorMessage = 'Failed to update profile.';
                if (resultAction.payload && typeof resultAction.payload === 'string') {
                    errorMessage = resultAction.payload;
                }
                toast.error(errorMessage);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to update profile.');
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleUploadSuccess = (pictureUrl: string) => {
        setLocalProfilePicture(pictureUrl);
        toast.success('Profile picture uploaded successfully!');
    };

    const upcomingClasses = [
        {
            id: 1,
            title: 'Morning Flow',
            date: 'Mon, Mar 18, 2024',
            time: '7:00 AM',
            instructor: 'Sarah Johnson',
        },
        {
            id: 2,
            title: 'Power Yoga',
            date: 'Wed, Mar 20, 2024',
            time: '6:00 PM',
            instructor: 'Michael Chen',
        },
    ];

    const pastClasses = [
        {
            id: 1,
            title: 'Meditation & Mindfulness',
            date: 'Mar 15, 2024',
            instructor: 'Emma Davis',
            rating: 5,
        },
        {
            id: 2,
            title: 'Yin Yoga',
            date: 'Mar 13, 2024',
            instructor: 'David Wilson',
            rating: 4,
        },
    ];

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <CircularProgress />
                <Typography>Loading profile...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography color="error">Error: {error}</Typography>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography>Please log in to view your profile.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, position: 'relative' }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
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
                <Typography variant="h4" gutterBottom align="center">
                    Profile
                </Typography>

                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    centered
                    sx={{ mb: 3 }}
                >
                    <Tab label="Profile Info" />
                    <Tab label="Classes" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}
                    >
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <ProfilePictureUpload
                                        currentPicture={user.profilePicture || user.avatar}
                                        onUploadSuccess={handleUploadSuccess}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Bio"
                                            name="bio"
                                            multiline
                                            rows={4}
                                            value={formData.bio}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                        >
                                            Update Profile
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Typography variant="h6" gutterBottom>
                        Upcoming Classes
                    </Typography>
                    <List>
                        {upcomingClasses.map((class_) => (
                            <React.Fragment key={class_.id}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <FitnessCenter />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={class_.title}
                                        secondary={`${class_.date} at ${class_.time} with ${class_.instructor}`}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>

                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                        Past Classes
                    </Typography>
                    <List>
                        {pastClasses.map((class_) => (
                            <React.Fragment key={class_.id}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <FitnessCenter />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={class_.title}
                                        secondary={`${class_.date} with ${class_.instructor}`}
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Star sx={{ color: '#F6E05E' }} />
                                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                                            {class_.rating}
                                        </Typography>
                                    </Box>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </TabPanel>
            </Paper>
        </Container>
    );
};

export default Profile;