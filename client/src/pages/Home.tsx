import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Icon,
  Divider,
  IconButton,
  TextField
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SpaIcon from '@mui/icons-material/Spa';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import StarRateIcon from '@mui/icons-material/StarRate';
import BookIcon from '@mui/icons-material/Book';
import EmailIcon from '@mui/icons-material/Email';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ForumIcon from '@mui/icons-material/Forum';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const featuredClasses = [
  {
    id: 1,
    title: 'Morning Flow Yoga',
    instructor: 'Asha Patel',
    date: 'Saturday, June 1',
    time: '9:00 AM IST',
    spotsLeft: 5,
    image: 'https://source.unsplash.com/random/400x300/?vinyasa-yoga-class,morning-light',
  },
  {
    id: 2,
    title: 'Evening Restorative',
    instructor: 'Rajesh Kumar',
    date: 'Sunday, June 2',
    time: '6:00 PM IST',
    spotsLeft: 3,
    image: 'https://source.unsplash.com/random/400x300/?restorative-yoga-class,calm-setting',
  },
  {
    id: 3,
    title: 'Power Vinyasa',
    instructor: 'Priya Sharma',
    date: 'Monday, June 3',
    time: '7:00 AM IST',
    spotsLeft: 8,
    image: 'https://source.unsplash.com/random/400x300/?power-yoga-class,energetic-group',
  },
];

const instructors = [
  {
    id: 1,
    name: 'Asha Patel',
    bio: 'Certified in Hatha and Vinyasa with 10+ years experience.',
    image: 'https://source.unsplash.com/random/300x300/?yoga-instructor-woman-smiling,indian-origin',
    specialties: ['Hatha', 'Vinyasa'],
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    bio: 'Focuses on alignment and therapeutic yoga.',
    image: 'https://source.unsplash.com/random/300x300/?yoga-instructor-man-smiling,asian',
    specialties: ['Therapeutic', 'Alignment'],
    rating: 4.7,
  },
  {
    id: 3,
    name: 'Priya Sharma',
    bio: 'Passionate about bringing mindfulness to every pose.',
    image: 'https://source.unsplash.com/random/300x300/?yoga-instructor-person-smiling,young-adult',
    specialties: ['Mindfulness', 'Restorative'],
    rating: 4.8,
  }
];

const testimonials = [
    {
        quote: 'YogaVibe has transformed my daily routine. The variety of classes is amazing!',
        name: 'Sarah K.',
        rating: 5,
        avatar: 'https://source.unsplash.com/random/100x100/?person-smiling,female,testimonial-avatar',
    },
    {
        quote: 'I love the instructors! They are so knowledgeable and supportive.',
        name: 'David L.',
        rating: 5,
        avatar: 'https://source.unsplash.com/random/100x100/?person-smiling,male,testimonial-avatar',
    },
    {
        quote: 'The personalized plans helped me achieve my flexibility goals.',
        name: 'Emily C.',
        rating: 4.8,
        avatar: 'https://source.unsplash.com/random/100x100/?person-smiling,young-adult,testimonial-avatar',
    },
];

const blogPosts = [
    {
        id: 1,
        title: '5 Yoga Poses for Better Sleep',
        thumbnail: 'https://source.unsplash.com/random/300x200/?yoga-sleep,bedroom-peaceful',
        excerpt: 'Struggling to get a good night\'s sleep? Incorporate these poses...',
    },
     {
        id: 2,
        title: 'The Benefits of Daily Meditation',
        thumbnail: 'https://source.unsplash.com/random/300x200/?meditation-benefits,peaceful-nature',
        excerpt: 'Discover how a few minutes of daily meditation can reduce stress...',
    },
];

const Home = () => {
  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', margin: 0, padding: 0 }}>
      {/* 🌟 2. Featured Classes Section */}
      {/* Corresponds to User Dashboard Feature: View Class Schedule/Catalog */}
      {/* Corresponds to Admin Panel Control: Manage Classes, View Bookings */}
      <Box
        id="classes"
        sx={{
          py: 16,
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center" className="mb-8 text-teal-800 font-serif">
            Upcoming & Popular Classes
          </Typography>
          <Grid container spacing={4}>
            {featuredClasses.map((classItem) => (
              <Grid item key={classItem.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 8,
                    },
                  }}
                  className="rounded-xl overflow-hidden shadow-lg border border-gray-200"
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={classItem.image}
                    alt={classItem.title}
                    className="object-cover"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3" className="font-semibold">
                      {classItem.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Instructor: {classItem.instructor}
                    </Typography>
                     <Box className="flex items-center text-sm text-gray-600 mb-1">
                       <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} /> {classItem.date}, {classItem.time}
                     </Box>
                      <Typography variant="body2" color="text.secondary">
                        Spots Left: {classItem.spotsLeft}
                      </Typography>
                  </CardContent>
                   <Box sx={{ px: 2, pb: 2 }}>
                     {/* Link to individual class page or booking */}
                     <Button
                       variant="contained"
                       color="primary"
                       size="small"
                       fullWidth
                       component={RouterLink}
                       to={'/classes'} // Link to classes page for now
                       // Or to={`/classes/${classItem.id}`} for individual class page
                       sx={{ transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'translateY(-2px)' } }}
                     >
                       Book Now
                     </Button>
                   </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
           <Box sx={{ mt: 6, textAlign: 'center' }}>
             <Button
               variant="outlined"
               color="primary"
               size="large"
               component={RouterLink}
               to="/classes"
               sx={{ px: 4, py: 1.5, transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'translateY(-3px)' } }}
             >
               View All Classes
             </Button>
           </Box>
        </Container>
      </Box>

      {/* 👩‍🏫 3. Meet the Instructors */}
      {/* Corresponds to User Dashboard Feature: View bios, book classes */}
      {/* Corresponds to Admin Panel Control: Admin can manage instructor data */}
       <Box id="instructors" sx={{ bgcolor: '#e0f7fa', py: 16 }}> {/* Increased vertical padding */}
         <Container maxWidth="lg">
           <Typography variant="h4" component="h2" gutterBottom align="center" className="mb-8 text-teal-800 font-serif">
             Meet Our Certified Instructors
           </Typography>
           <Grid container spacing={4} justifyContent="center">
             {instructors.map((instructor) => (
               <Grid item key={instructor.id} xs={12} sm={6} md={4}>
                 <Card className="rounded-xl shadow-lg h-full flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105">
                   <Box className="flex justify-center mt-6">
                      <CardMedia
                        component="img"
                        sx={{
                          width: 150, // Circular image size
                          height: 150,
                          borderRadius: '50%',
                          objectFit: 'cover', // Ensure image covers the circular area
                          border: '4px solid', // Add a border
                          borderColor: 'primary.main', // Border color
                        }}
                        image={instructor.image}
                        alt={instructor.name}
                      />
                   </Box>
                   <CardContent sx={{ flexGrow: 1 }} className="text-center pt-4">
                     <Typography gutterBottom variant="h6" component="h3" className="font-semibold">
                       {instructor.name}
                     </Typography>
                     <Typography variant="body2" color="text.secondary" paragraph>
                       {instructor.bio}
                     </Typography>
                     <Box className="flex items-center justify-center text-amber-500 mb-2">
                        <StarRateIcon sx={{ mr: 0.5 }} /> {instructor.rating.toFixed(1)} Average Rating
                     </Box>
                      <Typography variant="body2" color="text.primary">
                        Specialties: {instructor.specialties.join(', ')}
                      </Typography>
                   </CardContent>
                    <Box sx={{ px: 2, pb: 2 }}>
                      {/* Link to individual instructor page */}
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        component={RouterLink}
                         to={`/instructors/${instructor.id}`} // Placeholder link structure
                         sx={{ px: 4, py: 1, transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'translateY(-2px)' } }}
                      >
                        View Profile
                      </Button>
                    </Box>
                 </Card>
               </Grid>
             ))}
           </Grid>
         </Container>
       </Box>

      {/* 💳 4. Subscription Plans Section */}
      {/* Corresponds to User Dashboard Feature: Subscribe to plan */}
      {/* Corresponds to Admin Panel Control: Admin creates/modifies pricing & plans */}
       <Box id="pricing" sx={{ py: 16 }}> {/* Increased vertical padding */}
         <Typography variant="h4" component="h2" gutterBottom align="center" className="mb-8 text-teal-800 font-serif">
           Choose Your Plan
         </Typography>
         <Grid container spacing={4} justifyContent="center" alignItems="stretch"> {/* Added alignItems: stretch */}
           {/* Placeholder Plan Cards */}
            <Grid item xs={12} sm={6} md={4}>
              <Card className="rounded-xl shadow-lg h-full flex flex-col p-4 border border-gray-200 transition-transform duration-300 ease-in-out hover:scale-105">
                 <Typography variant="h5" component="h3" align="center" gutterBottom className="font-semibold">
                   Free Trial
                 </Typography>
                  <Typography variant="h4" align="center" color="primary" className="mb-4">
                    $0<Typography variant="caption">/month</Typography>
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" className="mb-2 flex items-center">
                      <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} /> Limited access to recorded classes
                    </Typography>
                     <Typography variant="body1" className="mb-2 flex items-center">
                      <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} /> Basic profile
                    </Typography>
                     <Typography variant="body1" color="text.secondary" className="mb-2 flex items-center opacity-70">
                      <CheckCircleOutlineIcon color="disabled" sx={{ mr: 1 }} /> No live classes
                    </Typography>
                     <Typography variant="body1" color="text.secondary" className="mb-2 flex items-center opacity-70">
                      <CheckCircleOutlineIcon color="disabled" sx={{ mr: 1 }} /> No personalized plans
                    </Typography>
                  </Box>
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} component={RouterLink} to="/register">
                    Book Now
                  </Button>
              </Card>
            </Grid>

             <Grid item xs={12} sm={6} md={4}>
              <Card className="rounded-xl shadow-lg border-2 border-teal-500 h-full flex flex-col p-4 transition-transform duration-300 ease-in-out hover:scale-105">
                 <Typography variant="h5" component="h3" align="center" gutterBottom className="font-semibold text-teal-700">
                   Basic Plan
                 </Typography>
                  <Typography variant="h4" align="center" color="primary" className="mb-4">
                    $19<Typography variant="caption">/month</Typography>
                  </Typography>
                   <Divider sx={{ my: 2 }} />
                   <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" className="mb-2 flex items-center">
                      <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} /> Full access to recorded classes
                    </Typography>
                     <Typography variant="body1" className="mb-2 flex items-center">
                      <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} /> Access to select live classes
                    </Typography>
                     <Typography variant="body1" className="mb-2 flex items-center">
                      <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} /> Standard profile & booking history
                    </Typography>
                     <Typography variant="body1" color="text.secondary" className="mb-2 flex items-center opacity-70">
                      <CheckCircleOutlineIcon color="disabled" sx={{ mr: 1 }} /> No personalized plans
                    </Typography>
                  </Box>
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} component={RouterLink} to="/register"> {/* Link to signup/subscription */}
                    Subscribe Basic
                  </Button>
              </Card>
            </Grid>

             <Grid item xs={12} sm={6} md={4}>
              <Card className="rounded-xl shadow-lg h-full flex flex-col p-4 border border-gray-200 transition-transform duration-300 ease-in-out hover:scale-105">
                 <Typography variant="h5" component="h3" align="center" gutterBottom className="font-semibold">
                   Premium Plan
                 </Typography>
                  <Typography variant="h4" align="center" color="primary" className="mb-4">
                    $29<Typography variant="caption">/month</Typography>
                  </Typography>
                   <Divider sx={{ my: 2 }} />
                   <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" className="mb-2 flex items-center">
                      <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} /> Full access to all classes (live & recorded)
                    </Typography>
                     <Typography variant="body1" className="mb-2 flex items-center">
                      <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} /> Personalized yoga plans
                    </Typography>
                     <Typography variant="body1" className="mb-2 flex items-center">
                      <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} /> Advanced progress tracking
                    </Typography>
                     <Typography variant="body1" className="mb-2 flex items-center">
                      <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} /> Community forum access
                    </Typography>
                  </Box>
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} component={RouterLink} to="/register"> {/* Link to signup/subscription */}
                    Subscribe Premium
                  </Button>
              </Card>
            </Grid>
         </Grid>
       </Box>

      {/* 📚 5. How It Works */}
      {/* Corresponds to User Dashboard Feature: Onboarding flow, Booking System */}
      {/* Corresponds to Admin Panel Control: N/A */}
       <Box id="how-it-works" sx={{ bgcolor: '#b2ebf2', py: 16 }}> {/* Increased vertical padding */}
         <Container maxWidth="lg">
           <Typography variant="h4" component="h2" gutterBottom align="center" className="mb-8 text-teal-800 font-serif">
             How It Works
           </Typography>
           <Grid container spacing={4} justifyContent="center" className="text-center">
             <Grid item xs={12} md={4}>
               <SpaIcon color="primary" sx={{ fontSize: 60 }} />
               <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                 1. Sign Up
               </Typography>
               <Typography variant="body1" color="text.secondary">
                 Create a free account and choose a plan.
               </Typography>
             </Grid>
             <Grid item xs={12} md={4}>
               <BookIcon color="primary" sx={{ fontSize: 60 }} />
               <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                 2. Explore & Book Sessions
               </Typography>
               <Typography variant="body1" color="text.secondary">
                 Browse our class catalog and book live or recorded sessions.
               </Typography>
             </Grid>
             <Grid item xs={12} md={4}>
               <SelfImprovementIcon color="primary" sx={{ fontSize: 60 }} />
               <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                 3. Track Your Progress
               </Typography>
               <Typography variant="body1" color="text.secondary">
                 Monitor your journey and see how you grow.
               </Typography>
             </Grid>
           </Grid>
         </Container>
       </Box>

      {/* 🌟 6. Testimonials */}
      {/* Corresponds to User Dashboard Feature: View/add feedback */}
      {/* Corresponds to Admin Panel Control: Admin approves/moderates reviews */}
       <Box id="testimonials" sx={{ py: 16 }}> {/* Increased vertical padding */}
         <Typography variant="h4" component="h2" gutterBottom align="center" className="mb-8 text-teal-800 font-serif">
           What Our Users Say
         </Typography>
         {/* Placeholder for Testimonials Slider - Using Grid for now */}
      </Box>

      {/* Add Blog Section */}
       <Box id="blog" sx={{ py: 16, bgcolor: '#fff9c4' }}> {/* Increased vertical padding */}
         <Container maxWidth="lg">
           <Typography variant="h4" component="h2" gutterBottom align="center" className="mb-8 text-teal-800 font-serif">
             Latest from Our Blog
           </Typography>
           <Grid container spacing={4}>
             {blogPosts.map((post) => (
               <Grid item key={post.id} xs={12} sm={6}>
                 <Card className="rounded-xl shadow-lg h-full flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105">
                   <CardMedia
                     component="img"
                     height="140"
                     image={post.thumbnail}
                     alt={post.title}
                     className="object-cover w-full"
                   />
                   <CardContent sx={{ flexGrow: 1 }}>
                     <Typography gutterBottom variant="h6" component="h3" className="font-semibold">
                       {post.title}
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                       {post.excerpt}
                     </Typography>
                   </CardContent>
                    <Box sx={{ px: 2, pb: 2 }}>
                      <Button size="small" component={RouterLink} to={'/blog'} endIcon={<ArrowForwardIcon />}>Read More</Button>
                    </Box>
                 </Card>
               </Grid>
             ))}
           </Grid>
           <Box sx={{ mt: 6, textAlign: 'center' }}>
             <Button
               variant="outlined"
               size="large"
               component={RouterLink}
               to="/blog"
               sx={{ px: 4, py: 1.5, transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'translateY(-3px)' } }}
             >
               View All Blog Posts
             </Button>
           </Box>
         </Container>
       </Box>

      {/* Add Progress & Stats Section (Placeholder)*/}
       <Box id="progress-stats" sx={{ py: 16 }}> {/* Increased vertical padding */}
         <Container maxWidth="lg">
           <Typography variant="h4" component="h2" gutterBottom align="center" className="mb-8 text-teal-800 font-serif">
             Track Your Progress
           </Typography>
           <Typography variant="body1" align="center" color="text.secondary">
             (Placeholder for user progress and statistics section)
           </Typography>
         </Container>
       </Box>

      {/* Add Community Section (Placeholder)*/}
       <Box id="community" sx={{ py: 16, bgcolor: '#e0f7fa' }}> {/* Increased vertical padding */}
         <Container maxWidth="lg">
           <Typography variant="h4" component="h2" gutterBottom align="center" className="mb-8 text-teal-800 font-serif">
             Join Our Community
           </Typography>
           <Typography variant="body1" align="center" color="text.secondary">
             (Placeholder for community forum or features)
           </Typography>
         </Container>
       </Box>

      {/* Add Newsletter & Contact Section */}
       <Box id="contact" sx={{ py: 16 }}> {/* Increased vertical padding */}
         <Container maxWidth="lg">
           <Typography variant="h4" component="h2" gutterBottom align="center" className="mb-8 text-teal-800 font-serif">
             Stay Connected
           </Typography>
           <Grid container spacing={4} justifyContent="center">
             <Grid item xs={12} md={6}>
               <Box className="text-center">
                 <EmailIcon color="primary" sx={{ fontSize: 60 }} />
                 <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                   Subscribe to Our Newsletter
                 </Typography>
                 <Typography variant="body1" color="text.secondary" paragraph>
                   Get the latest updates, class schedules, and tips directly to your inbox.
                 </Typography>
                 <Box component="form" sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center' }}>
                   <TextField
                     label="Enter your email"
                     variant="outlined"
                     size="small"
                     sx={{ flexGrow: 1, maxWidth: 300 }}
                   />
                   <Button variant="contained" color="primary" size="small">Subscribe</Button>
                 </Box>
               </Box>
             </Grid>
             <Grid item xs={12} md={6}>
               <Box className="text-center">
                 <RssFeedIcon color="primary" sx={{ fontSize: 60 }} />
                 <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                   Follow Us
                 </Typography>
                 <Typography variant="body1" color="text.secondary" paragraph>
                   Connect with us on social media.
                 </Typography>
                 <Box sx={{ mt: 3 }}>
                   <IconButton color="primary" aria-label="facebook">
                     <FacebookIcon fontSize="large" />
                   </IconButton>
                   <IconButton color="primary" aria-label="twitter" sx={{ mx: 2 }}>
                     <TwitterIcon fontSize="large" />
                   </IconButton>
                   <IconButton color="primary" aria-label="instagram">
                     <InstagramIcon fontSize="large" />
                   </IconButton>
                 </Box>
               </Box>
             </Grid>
           </Grid>
         </Container>
       </Box>

    </Box>
  );
};

export default Home; 