import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { authService } from '../../api/services/auth.service';

export function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            await authService.forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f7fa',
                padding: 2,
            }}
        >
            <Card
                sx={{
                    maxWidth: 480,
                    width: '100%',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    borderRadius: 2,
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                backgroundColor: '#eff6ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                            }}
                        >
                            <FiMail size={28} color="#3b82f6" />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                            Forgot Password?
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Enter your email and we'll send you a link to reset your password
                        </Typography>
                    </Box>

                    {/* Success Message */}
                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Check your email!</Typography>
                            <Typography variant="body2">
                                If an account exists with this email, you will receive a password reset link shortly.
                            </Typography>
                        </Alert>
                    )}

                    {/* Error Message */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Form */}
                    {!success && (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                disabled={isLoading}
                                sx={{ mb: 3 }}
                                autoFocus
                            />

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={isLoading}
                                sx={{
                                    mb: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    py: 1.5,
                                }}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                            </Button>
                        </form>
                    )}

                    {/* Back to Login */}
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button
                            component={Link}
                            to="/login"
                            startIcon={<FiArrowLeft />}
                            sx={{
                                textTransform: 'none',
                                color: '#64748b',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: '#3b82f6',
                                },
                            }}
                        >
                            Back to Login
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
