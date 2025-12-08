import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { apiClient } from '../../api';
import { routes } from '../../constants/routes';

export const ActivateUser = () => {
    const { uid, token, activationKey } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [linkValid, setLinkValid] = useState(false);

    useEffect(() => {
        const checkLink = async () => {
            try {
                const url = `auth/activate-user/${uid}/${token}/${activationKey}/`;
                const response = await apiClient.get(url);

                if (!response.data.error) {
                    setLinkValid(true);
                    setEmail(response.data.email);
                } else {
                    setError(response.data.error || 'Invalid or expired activation link');
                }
            } catch (err: any) {
                setError('Failed to validate activation link');
            } finally {
                setLoading(false);
            }
        };

        checkLink();
    }, [uid, token, activationKey]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const url = `auth/activate-user/${uid}/${token}/${activationKey}/`;
            const response = await apiClient.post(url, {
                password,
                password_confirm: passwordConfirm,
            });

            if (!response.data.error) {
                localStorage.setItem('Token', response.data.access);
                localStorage.setItem('refresh', response.data.refresh);
                localStorage.setItem('user_id', response.data.user.id);
                localStorage.setItem('email', response.data.user.email);

                window.location.href = routes.app.main;
            } else {
                setError(response.data.error || 'Failed to activate account');
            }
        } catch (err: any) {
            setError('Failed to activate account. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Validating activation link...</Typography>
            </Box>
        );
    }

    if (!linkValid || error) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    padding: 3,
                }}
            >
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: 3,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: 'white',
                }}
            >
                <Typography variant="h4" sx={{ mb: 1, textAlign: 'center' }}>
                    Set Your Password
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
                    Welcome to Bottle CRM! Create your password to activate your account.
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                    Email: <strong>{email}</strong>
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                        helperText="Minimum 8 characters"
                    />

                    <TextField
                        fullWidth
                        type="password"
                        label="Confirm Password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                        sx={{ mb: 3 }}
                    />

                    <Button fullWidth type="submit" variant="contained" disabled={submitting} sx={{ py: 1.5 }}>
                        {submitting ? <CircularProgress size={24} /> : 'Activate Account'}
                    </Button>
                </form>
            </Box>
        </Box>
    );
};
