import React from 'react';
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

interface Props {
    open: boolean;
    message?: string;
    secondaryMessage?: string;
    size?: 'small' | 'medium' | 'large';
    blur?: boolean;
}

const pulseAnimation = keyframes`
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.05);
        opacity: 0.8;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
`;

const fadeInScale = keyframes`
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
`;

const spinnerRotate = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const SIZE_CONFIG = {
    small: {
        spinner: 40,
        message: 'body1',
        secondary: 'body2',
        gap: 1.5,
        padding: 3,
    },
    medium: {
        spinner: 60,
        message: 'h6',
        secondary: 'body1',
        gap: 2,
        padding: 4,
    },
    large: {
        spinner: 80,
        message: 'h5',
        secondary: 'h6',
        gap: 2.5,
        padding: 5,
    },
};

export const LoadingBackdrop: React.FC<Props> = ({
    open,
    message = 'Loading...',
    secondaryMessage,
    size = 'medium',
    blur = true,
}) => {
    const config = SIZE_CONFIG[size];

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backdropFilter: blur ? 'blur(8px)' : 'none',
                backgroundColor: blur ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.6)',
                transition: 'all 0.3s ease-in-out',
            }}
            open={open}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: config.gap,
                    padding: config.padding,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    animation: `${fadeInScale} 0.3s ease-out`,
                    minWidth: 280,
                    maxWidth: 400,
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: `${pulseAnimation} 2s ease-in-out infinite`,
                    }}
                >
                    <CircularProgress
                        size={config.spinner}
                        thickness={3}
                        sx={{
                            color: '#fff',
                            animation: `${spinnerRotate} 1s linear infinite`,
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            width: config.spinner * 0.6,
                            height: config.spinner * 0.6,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                        }}
                    />
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        variant={config.message as any}
                        sx={{
                            fontWeight: 600,
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            letterSpacing: '0.5px',
                        }}
                    >
                        {message}
                    </Typography>

                    {secondaryMessage && (
                        <Typography
                            variant={config.secondary as any}
                            sx={{
                                marginTop: 1,
                                opacity: 0.85,
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                                fontWeight: 400,
                            }}
                        >
                            {secondaryMessage}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Backdrop>
    );
};
