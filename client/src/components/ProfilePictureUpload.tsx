import React, { useState, useRef } from 'react';
import { Box, Avatar, IconButton, Typography, CircularProgress } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { uploadProfilePicture } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { AppDispatch } from '../store';

interface ProfilePictureUploadProps {
    currentPicture?: string;
    onUploadSuccess: (pictureUrl: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ currentPicture, onUploadSuccess }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [preview, setPreview] = useState<string | null>(currentPicture || null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            setLoading(true);
            const formData = new FormData();
            formData.append('profilePicture', file);

            try {
                const resultAction = await dispatch(uploadProfilePicture(formData));
                if (uploadProfilePicture.fulfilled.match(resultAction)) {
                    const pictureUrl = resultAction.payload.profilePicture;
                    onUploadSuccess(pictureUrl);
                } else {
                    let errorMessage = 'Failed to upload profile picture.';
                    if (resultAction.payload && typeof resultAction.payload === 'string') {
                        errorMessage = resultAction.payload;
                    }
                    toast.error(errorMessage);
                }
            } catch (error: any) {
                toast.error(error.message || 'Failed to upload profile picture.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={fileInputRef}
            />
            <Box sx={{ position: 'relative' }}>
                <Avatar
                    src={preview || undefined}
                    sx={{
                        width: 120,
                        height: 120,
                        cursor: 'pointer',
                        '&:hover': {
                            opacity: 0.8,
                        },
                    }}
                    onClick={handleClick}
                />
                {loading && (
                    <CircularProgress
                        size={60}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-30px',
                            marginLeft: '-30px',
                            color: 'primary.main',
                        }}
                    />
                )}
                <IconButton
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        },
                    }}
                    onClick={handleClick}
                    disabled={loading}
                >
                    <PhotoCamera />
                </IconButton>
            </Box>
            <Typography
                variant="caption"
                sx={{
                    display: 'block',
                    textAlign: 'center',
                    mt: 1,
                    color: 'text.secondary',
                }}
            >
                Click to change profile picture
            </Typography>
        </Box>
    );
};

export default ProfilePictureUpload; 