import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Link as MuiLink,
} from '@mui/material';
import { InsertDriveFile as ArticleIcon, Link as LinkIcon, YouTube as YouTubeIcon, VideoFile as VideoFileIcon, InsertDriveFile as InsertDriveFileIcon } from '@mui/icons-material';
import axios from 'axios';
import { IContent } from '../../types';

const UserContent: React.FC = () => {
  const [content, setContent] = useState<IContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/content/content');
        setContent(response.data.data);
      } catch (err: any) {
        console.error('Error fetching user content:', err);
        setError(err.response?.data?.error || 'Failed to load content.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'youtube':
        return <YouTubeIcon color="error" />;
      case 'website':
        return <LinkIcon color="primary" />;
      case 'article':
        return <ArticleIcon color="info" />;
      case 'manual_video':
        return <VideoFileIcon color="secondary" />;
      case 'pdf':
        return <InsertDriveFileIcon color="warning" />;
      default:
        return <LinkIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
        <CircularProgress />
        <Typography variant="h6" ml={2}>Loading Content...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading content: {error}</Alert>;
  }

  return (
    <Card sx={{ mt: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Additional Resources
        </Typography>
        {content.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No additional content available at the moment.
          </Typography>
        ) : (
          <List>
            {content.map((item) => (
              <ListItem key={item._id} disablePadding>
                <ListItemIcon>
                  {getContentIcon(item.contentType)}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
                <MuiLink href={item.url} target="_blank" rel="noopener noreferrer" sx={{ ml: 2 }}>
                  View
                </MuiLink>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default UserContent; 