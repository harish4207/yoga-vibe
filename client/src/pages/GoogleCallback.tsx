import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppSelector';
import { getProfile } from '../store/slices/authSlice';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
          localStorage.setItem('token', token);
          await dispatch(getProfile()).unwrap();
          navigate('/');
        } else {
          console.error('No token found in Google callback URL.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Google authentication error:', error);
        navigate('/login');
      }
    };

    handleGoogleCallback();
  }, [location, navigate, dispatch]);

  return (
    <div>
      Processing Google authentication...
    </div>
  );
};

export default GoogleCallback; 