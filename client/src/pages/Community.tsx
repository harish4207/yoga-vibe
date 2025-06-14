import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Avatar,
  TextField,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  Comment,
  Event,
} from '@mui/icons-material';
import { useState } from 'react';

const events = [
  {
    id: 1,
    title: 'Yoga Retreat Weekend',
    date: 'Apr 15-17, 2024',
    location: 'Mountain View Resort',
    image: 'https://source.unsplash.com/random/400x300/?yoga-retreat',
    description: 'Join us for a transformative weekend of yoga, meditation, and connection with nature.',
  },
  {
    id: 2,
    title: 'Community Workshop',
    date: 'Mar 25, 2024',
    location: 'Main Studio',
    image: 'https://source.unsplash.com/random/400x300/?yoga-workshop',
    description: 'Learn advanced breathing techniques and their benefits for daily practice.',
  },
];

const posts = [
  {
    id: 1,
    author: 'Sarah Johnson',
    avatar: 'https://source.unsplash.com/random/100x100/?portrait-1',
    content: 'Just completed my 100th class! The journey has been incredible. Thank you all for the support! 🙏',
    likes: 24,
    comments: 5,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    author: 'Michael Chen',
    avatar: 'https://source.unsplash.com/random/100x100/?portrait-2',
    content: 'Sharing some tips for maintaining a consistent morning practice. What works for you?',
    likes: 18,
    comments: 8,
    timestamp: '5 hours ago',
  },
];

const Community = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const handleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 4,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" gutterBottom>
            Community
          </Typography>
          <Typography variant="h6">
            Connect with fellow yogis and stay updated with events
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Main Feed */}
          <Grid item xs={12} md={8}>
            {/* Create Post */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src="https://source.unsplash.com/random/100x100/?portrait"
                    sx={{ mr: 2 }}
                  />
                  <TextField
                    fullWidth
                    placeholder="Share your thoughts with the community..."
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Button variant="contained" color="primary">
                  Post
                </Button>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            {posts.map((post) => (
              <Card key={post.id} sx={{ mb: 4 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={post.avatar} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1">{post.author}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {post.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" paragraph>
                    {post.content}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={() => handleLike(post.id)}
                      color="primary"
                    >
                      {likedPosts.includes(post.id) ? (
                        <Favorite />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>
                    <Typography sx={{ mr: 2 }}>{post.likes}</Typography>
                    <IconButton>
                      <Comment />
                    </IconButton>
                    <Typography sx={{ mr: 2 }}>{post.comments}</Typography>
                    <IconButton>
                      <Share />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Events Sidebar */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              Upcoming Events
            </Typography>
            {events.map((event) => (
              <Card key={event.id} sx={{ mb: 3 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={event.image}
                  alt={event.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Event sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.date}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.location}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {event.description}
                  </Typography>
                  <Button variant="outlined" color="primary" fullWidth>
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Community; 