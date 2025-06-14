import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Divider } from '@mui/material';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SpaIcon from '@mui/icons-material/Spa';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const yogaBenefits = [
  {
    title: 'Improved Flexibility',
    description: 'Yoga poses stretch muscles and connective tissues, increasing range of motion.',
    icon: <FitnessCenterIcon color="primary" sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Increased Strength',
    description: 'Many poses require supporting your body weight, building muscle strength.',
    icon: <FitnessCenterIcon color="primary" sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Reduced Stress',
    description: 'Yoga and meditation calm the nervous system, lowering stress hormones.',
    icon: <SpaIcon color="primary" sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Better Posture',
    description: 'Strengthening core muscles and improving body awareness leads to better posture.',
    icon: <SelfImprovementIcon color="primary" sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Improved Mental Health',
    description: 'Reduces symptoms of depression and anxiety, promoting a sense of well-being.',
    icon: <PsychologyIcon color="primary" sx={{ fontSize: 40 }} />,
  },
   {
    title: 'Enhanced Mindfulness',
    description: 'Focusing on breath and movement increases present moment awareness.',
    icon: <SelfImprovementIcon color="primary" sx={{ fontSize: 40 }} />,
  },
   {
    title: 'Pain Reduction',
    description: 'Can alleviate chronic pain, especially in the back and joints.',
    icon: <LocalHospitalIcon color="primary" sx={{ fontSize: 40 }} />,
  },
    {
    title: 'Increased Energy',
    description: 'Combats fatigue and increases vitality through improved circulation and breathwork.',
    icon: <EmojiEventsIcon color="primary" sx={{ fontSize: 40 }} />,
  },
];

const yogaImages = [
  { url: 'https://source.unsplash.com/random/800x600/?yoga-pose-beginner,peaceful', alt: 'Beginner yoga pose' },
  { url: 'https://source.unsplash.com/random/800x600/?meditation-calm,nature', alt: 'Meditation in nature' },
  { url: 'https://source.unsplash.com/random/800x600/?group-yoga,studio', alt: 'Group yoga class' },
  { url: 'https://source.unsplash.com/random/800x600/?yoga-pose-advanced,strength', alt: 'Advanced yoga pose' },
  { url: 'https://source.unsplash.com/random/800x600/?yoga-stretch,relaxing', alt: 'Yoga stretching' },
];


const YogaBenefits = () => {
  return (
    <Box className="min-h-screen bg-white text-gray-800 py-8">
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom align="center" className="mb-8 text-teal-800 font-serif">
          The Benefits of Yoga
        </Typography>

        {/* Yoga Images Section */}
         <Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
           {yogaImages.map((image, index) => (
             <Grid item key={index} xs={12} sm={6} md={4}>
               <Card className="rounded-xl shadow-lg overflow-hidden">
                 <CardMedia
                   component="img"
                   height="250"
                   image={image.url}
                   alt={image.alt}
                   className="object-cover w-full"
                 />
               </Card>
             </Grid>
           ))}
         </Grid>

        <Divider sx={{ my: 8 }} />

        {/* Health Benefits Section */}
        <Typography variant="h4" component="h2" gutterBottom align="center" className="mb-8 text-teal-800 font-serif">
          Key Health Benefits
        </Typography>
        <Grid container spacing={4}>
          {yogaBenefits.map((benefit, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Box className="flex items-start p-4 bg-gray-50 rounded-lg shadow-md">
                <Box sx={{ mr: 2 }}>{benefit.icon}</Box>
                <Box>
                  <Typography variant="h6" component="h3" gutterBottom className="font-semibold">
                    {benefit.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

         {/* Placeholder for Yoga Poses with Names (Future Enhancement) */}
          <Box sx={{ mt: 8, textAlign: 'center' }}>
             <Typography variant="h4" component="h2" gutterBottom className="mb-4 text-teal-800 font-serif">
               Explore Yoga Poses
             </Typography>
             <Typography variant="body1" color="text.secondary">
               [Section with Yoga Pose Images and Sanskrit/English Names Coming Soon]
             </Typography>
          </Box>

      </Container>
    </Box>
  );
};

export default YogaBenefits; 