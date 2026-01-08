import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { authService } from '../../api/services/auth.service';

export function ResetPassword() {
    const navigate = useNavigate();
    const { uidb64, token } = useParams<{ uidb64: string; token: string }>();

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Validate URL params
        if (!uidb64 || !token) {
            setError('Invalid reset link');
        }
    }, [uidb64, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!password.trim()) {
            setError('Please enter a password');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (password !== passwordConfirm) {
            setError('Passwords do not match');
            return;
        }

        if (!uidb64 || !token) {
            setError('Invalid reset link');
            return;
        }

        setIsLoading(true);

        try {
            await authService.resetPassword(uidb64, token, password, passwordConfirm);
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
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
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                backgroundColor: '#d1fae5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                            }}
                        >
                            <FiCheckCircle size={32} color="#10b981" />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
                            Password Reset Successful!
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                            Your password has been changed successfully. You can now login with your new password.
                        </Typography>
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '16px',
                                py: 1.5,
                            }}
                        >
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        );
    }

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
                            <FiLock size={28} color="#3b82f6" />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                            Set New Password
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Enter your new password below
                        </Typography>
                    </Box>

                    {/* Error Message */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="New Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            disabled={isLoading}
                            sx={{ mb: 2 }}
                            autoFocus
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            type={showPasswordConfirm ? 'text' : 'password'}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder="Confirm new password"
                            disabled={isLoading}
                            sx={{ mb: 3 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                            edge="end"
                                        >
                                            {showPasswordConfirm ? <FiEyeOff /> : <FiEye />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 3 }}>
                            Password must be at least 8 characters long
                        </Typography>

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '16px',
                                py: 1.5,
                            }}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
                        </Button>
                    </form>

                    {/* Back to Login */}
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button
                            component={Link}
                            to="/login"
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
