import { FormEvent, useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom'; // ← додай Link
import { FiMail, FiLock } from 'react-icons/fi';
import imgGoogle from '../../assets/images/auth/google.svg';
import imgLogo from '../../assets/images/auth/img_logo.png';
import { ITextField } from '../../components/ui';
import { apiClient, ENDPOINTS } from '../../api';
import { routes } from '../../constants/routes';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (localStorage.getItem('Token')) {
            navigate(routes.app.main);
        }
    }, [navigate]);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await apiClient.post(ENDPOINTS.LOGIN_GOOGLE, {
                    token: tokenResponse.access_token,
                });

                if (response.data?.access_token) {
                    localStorage.setItem('Token', `Bearer ${response.data.access_token}`);
                    navigate(routes.app.main);
                } else {
                    setError('Google sign-in failed. Please try again.');
                }
            } catch (error: any) {
                console.error('Google auth error:', error);
                setError(error.response?.data?.detail || 'Google sign-in failed. Please try again.');
            }
        },
    });

    const onEmailLoginSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const response = await apiClient.post(ENDPOINTS.LOGIN, {
                email: email.trim(),
                password: password,
            });

            const data = response.data;

            if (data?.access) {
                localStorage.setItem('Token', `Bearer ${data.access}`);
                if (data?.refresh) {
                    localStorage.setItem('RefreshToken', data.refresh);
                }
                localStorage.setItem('userEmail', email.trim());
                navigate(routes.app.main);
            } else {
                setError('Invalid email or password');
            }
        } catch (error: any) {
            console.error('Login error:', error);

            if (error.response) {
                const errorData = error.response.data;
                setError(errorData?.detail || errorData?.message || errorData?.error || 'Invalid email or password');
            } else if (error.request) {
                setError('Server is not responding. Please try again later.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: '#f9fafb',
            }}
        >
            {/* Left Side - Login Form */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 4,
                    backgroundColor: 'white',
                }}
            >
                <Box sx={{ width: '100%', maxWidth: '420px' }}>
                    {/* Logo */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <img
                            src={imgLogo}
                            alt="Bottle CRM"
                            style={{
                                width: '200px',
                                height: '60px',
                                marginBottom: '16px',
                            }}
                        />
                        <Typography
                            sx={{
                                fontSize: '28px',
                                fontWeight: 700,
                                color: '#111827',
                                mb: 1,
                            }}
                        >
                            Welcome back
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '14px',
                                color: '#6b7280',
                            }}
                        >
                            Sign in to your account to continue
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: '12px',
                                '& .MuiAlert-message': {
                                    fontSize: '14px',
                                },
                            }}
                            onClose={() => setError(null)}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <Box component="form" onSubmit={onEmailLoginSubmit}>
                        <ITextField
                            label="Email Address"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            disabled={submitting}
                            endAdornment={<FiMail style={{ color: '#9ca3af' }} />}
                        />

                        <Box sx={{ mt: 2 }}>
                            <ITextField
                                label="Password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                disabled={submitting}
                                endAdornment={<FiLock style={{ color: '#9ca3af' }} />}
                            />
                        </Box>

                        {/* ✅ ДОДАНО: Forgot Password Link */}
                        <Box sx={{ textAlign: 'right', mt: 1 }}>
                            <Link
                                to="/forgot-password"
                                style={{
                                    color: '#6366f1',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    transition: 'color 0.2s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#4f46e5')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#6366f1')}
                            >
                                Forgot password?
                            </Link>
                        </Box>

                        {/* Sign In Button */}
                        <Box
                            component="button"
                            type="submit"
                            disabled={submitting}
                            sx={{
                                width: '100%',
                                mt: 3,
                                py: 1.5,
                                px: 3,
                                backgroundColor: submitting ? '#e0e7ff' : '#6366f1',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: 600,
                                border: 'none',
                                borderRadius: '10px',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                '&:hover': {
                                    backgroundColor: submitting ? '#e0e7ff' : '#4f46e5',
                                    transform: submitting ? 'none' : 'translateY(-1px)',
                                    boxShadow: submitting ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)',
                                },
                                '&:active': {
                                    transform: submitting ? 'none' : 'translateY(0)',
                                },
                            }}
                        >
                            {submitting ? (
                                <>
                                    <CircularProgress size={18} sx={{ color: 'white' }} />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Box>

                        {/* Divider */}
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                            <Box sx={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
                            <Typography sx={{ px: 2, fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>
                                OR
                            </Typography>
                            <Box sx={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
                        </Box>

                        {/* Google Sign In Button */}
                        <Box
                            component="button"
                            type="button"
                            onClick={() => login()}
                            disabled={submitting}
                            sx={{
                                width: '100%',
                                py: 1.5,
                                px: 3,
                                backgroundColor: 'white',
                                color: '#374151',
                                fontSize: '15px',
                                fontWeight: 600,
                                border: '1.5px solid #e5e7eb',
                                borderRadius: '10px',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                                '&:hover': {
                                    backgroundColor: submitting ? 'white' : '#f9fafb',
                                    borderColor: submitting ? '#e5e7eb' : '#d1d5db',
                                    transform: submitting ? 'none' : 'translateY(-1px)',
                                    boxShadow: submitting ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                                },
                                '&:active': {
                                    transform: submitting ? 'none' : 'translateY(0)',
                                },
                            }}
                        >
                            <img src={imgGoogle} alt="Google" style={{ width: '20px', height: '20px' }} />
                            Sign in with Google
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Right Side - Hero Section */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: 6,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                        pointerEvents: 'none',
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center',
                        maxWidth: '500px',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '42px',
                            fontWeight: 800,
                            color: 'white',
                            mb: 2,
                            lineHeight: 1.2,
                            textShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        Welcome to Bottle CRM
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '18px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            mb: 4,
                            lineHeight: 1.6,
                        }}
                    >
                        Free and open-source CRM solution designed for small and medium businesses
                    </Typography>

                    {/* Feature Cards */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 6 }}>
                        {[
                            { title: 'Lead Management', desc: 'Track and nurture your leads effectively' },
                            { title: 'Team Collaboration', desc: 'Work seamlessly with your team' },
                            { title: 'Analytics & Reports', desc: 'Make data-driven decisions' },
                        ].map((feature, index) => (
                            <Box
                                key={index}
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '16px',
                                    padding: 2.5,
                                    textAlign: 'left',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        transform: 'translateX(8px)',
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        color: 'white',
                                        mb: 0.5,
                                    }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '14px',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                    }}
                                >
                                    {feature.desc}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Typography
                        sx={{
                            mt: 6,
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: 500,
                        }}
                    >
                        bottlecrm.com
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
