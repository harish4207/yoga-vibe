import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  isFeatured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Science of Yoga: How It Transforms Your Body and Mind",
    excerpt: "Discover the scientific evidence behind yoga's benefits for physical and mental health.",
    image: "/blog/featured-post.jpg",
    category: "Wellness",
    author: {
      name: "Dr. Sarah Johnson",
      avatar: "/blog/authors/sarah.jpg",
    },
    date: "March 15, 2024",
    readTime: "8 min read",
    isFeatured: true,
  },
  {
    id: 2,
    title: "5 Essential Yoga Poses for Beginners",
    excerpt: "Start your yoga journey with these fundamental poses that build strength and flexibility.",
    image: "/blog/beginner-poses.jpg",
    category: "Beginners",
    author: {
      name: "Michael Chen",
      avatar: "/blog/authors/michael.jpg",
    },
    date: "March 12, 2024",
    readTime: "5 min read",
  },
  {
    id: 3,
    title: "Mindfulness Meditation: A Guide to Inner Peace",
    excerpt: "Learn how to incorporate mindfulness meditation into your daily routine.",
    image: "/blog/meditation.jpg",
    category: "Meditation",
    author: {
      name: "Priya Sharma",
      avatar: "/blog/authors/priya.jpg",
    },
    date: "March 10, 2024",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Yoga for Stress Relief: Techniques That Work",
    excerpt: "Effective yoga techniques to manage stress and anxiety in your daily life.",
    image: "/blog/stress-relief.jpg",
    category: "Wellness",
    author: {
      name: "David Martinez",
      avatar: "/blog/authors/david.jpg",
    },
    date: "March 8, 2024",
    readTime: "7 min read",
  },
];

const BlogSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const featuredPost = blogPosts.find(post => post.isFeatured);
  const regularPosts = blogPosts.filter(post => !post.isFeatured);

  return (
    <Box
      id="blog"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: '#1A202C',
              mb: 2,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Latest from Our Blog
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#4A5568',
              maxWidth: '600px',
              mx: 'auto',
              fontFamily: '"Lora", serif',
            }}
          >
            Insights, tips, and stories to inspire your yoga journey
          </Typography>
        </Box>

        {/* Featured Post */}
        {featuredPost && (
          <Card
            sx={{
              mb: { xs: 6, md: 8 },
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Grid container>
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  image={featuredPost.image}
                  alt={featuredPost.title}
                  sx={{
                    height: { xs: '300px', md: '100%' },
                    objectFit: 'cover',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent
                  sx={{
                    p: { xs: 3, md: 4 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Chip
                    label={featuredPost.category}
                    sx={{
                      bgcolor: 'rgba(246, 224, 94, 0.2)',
                      color: '#805AD5',
                      fontWeight: 500,
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: '#1A202C',
                      mb: 2,
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    {featuredPost.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#4A5568',
                      mb: 3,
                      fontFamily: '"Lora", serif',
                    }}
                  >
                    {featuredPost.excerpt}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Avatar
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: '#1A202C',
                        }}
                      >
                        {featuredPost.author.name}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: '#4A5568',
                        }}
                      >
                        <CalendarIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">
                          {featuredPost.date}
                        </Typography>
                        <Box sx={{ mx: 1 }}>•</Box>
                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">
                          {featuredPost.readTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      alignSelf: 'flex-start',
                      bgcolor: '#F6E05E',
                      color: '#1A202C',
                      '&:hover': {
                        bgcolor: '#C0A14F',
                      },
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Regular Posts Grid */}
        <Grid container spacing={4}>
          {regularPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={post.image}
                  alt={post.title}
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Chip
                    label={post.category}
                    sx={{
                      bgcolor: 'rgba(246, 224, 94, 0.2)',
                      color: '#805AD5',
                      fontWeight: 500,
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#1A202C',
                      mb: 2,
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4A5568',
                      mb: 3,
                      fontFamily: '"Lora", serif',
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Avatar
                      src={post.author.avatar}
                      alt={post.author.name}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: '#1A202C',
                        }}
                      >
                        {post.author.name}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: '#4A5568',
                        }}
                      >
                        <CalendarIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption">
                          {post.date}
                        </Typography>
                        <Box sx={{ mx: 1 }}>•</Box>
                        <AccessTimeIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption">
                          {post.readTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    variant="text"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      color: '#805AD5',
                      '&:hover': {
                        color: '#6B46C1',
                      },
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* View All Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: { xs: 6, md: 8 },
          }}
        >
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderColor: '#F6E05E',
              color: '#1A202C',
              '&:hover': {
                borderColor: '#C0A14F',
                bgcolor: 'rgba(246, 224, 94, 0.1)',
              },
            }}
          >
            View All Articles
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogSection; 