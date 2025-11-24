import React from 'react';
import { Paper, Typography, Stack, Box, IconButton } from '@mui/material';
import { FaPlus, FaDownload, FaFileAlt, FaTrash } from 'react-icons/fa';

interface Attachment {
    id: string;
    file_name: string;
    file_path: string;
    created_at: string;
    created_by: string;
}

interface Props {
    attachments: Attachment[];
    onFileUpload: (file: File) => void;
    onDeleteAttachment?: (attachmentId: string) => void;
}

export const AttachmentsCard: React.FC<Props> = ({ attachments, onFileUpload, onDeleteAttachment }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
            event.target.value = '';
        }
    };

    const getDownloadUrl = (filePath: string) => {
        const fullUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/app';
        const baseUrl = fullUrl.split('/api')[0];
        return `${baseUrl}${filePath}`;
    };

    const handleDownload = async (attachment: Attachment) => {
        try {
            const url = getDownloadUrl(attachment.file_path);
            const response = await fetch(url);
            const blob = await response.blob();

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = attachment.file_name;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Failed to download file:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getFileExtension = (fileName: string) => {
        return fileName.split('.').pop()?.toUpperCase() || 'FILE';
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        const colors: Record<string, string> = {
            pdf: '#e74c3c',
            doc: '#3498db',
            docx: '#3498db',
            xls: '#27ae60',
            xlsx: '#27ae60',
            jpg: '#9b59b6',
            jpeg: '#9b59b6',
            png: '#9b59b6',
            txt: '#95a5a6',
        };
        return colors[ext || ''] || '#6366f1';
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mb: 3,
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: '#fafafa',
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600} color="#1a3353">
                    Attachments ({attachments.length})
                </Typography>
                <IconButton
                    component="label"
                    size="small"
                    sx={{
                        backgroundColor: '#6366f1',
                        color: 'white',
                        '&:hover': { backgroundColor: '#4f46e5' },
                    }}
                >
                    <FaPlus style={{ fontSize: '12px' }} />
                    <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                    />
                </IconButton>
            </Stack>
            <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                {attachments.length > 0 ? (
                    attachments.map((att: Attachment) => (
                        <Box
                            key={att.id}
                            sx={{
                                mb: 1.5,
                                p: 2,
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: '#6366f1',
                                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)',
                                },
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center" flex={1}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '8px',
                                        backgroundColor: `${getFileIcon(att.file_name)}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <FaFileAlt
                                        style={{
                                            color: getFileIcon(att.file_name),
                                            fontSize: '18px',
                                        }}
                                    />
                                </Box>
                                <Box flex={1}>
                                    <Typography variant="body2" fontWeight={500} noWrap>
                                        {att.file_name}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDate(att.created_at)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            •
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: getFileIcon(att.file_name),
                                                fontWeight: 600,
                                            }}
                                        >
                                            {getFileExtension(att.file_name)}
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={0.5}>
                                <IconButton
                                    onClick={() => handleDownload(att)}
                                    size="small"
                                    sx={{
                                        color: '#6366f1',
                                        '&:hover': { backgroundColor: '#f0f0ff' },
                                    }}
                                >
                                    <FaDownload style={{ fontSize: '14px' }} />
                                </IconButton>
                                {onDeleteAttachment && (
                                    <IconButton
                                        onClick={() => onDeleteAttachment(att.id)}
                                        size="small"
                                        sx={{
                                            color: '#ef4444',
                                            '&:hover': { backgroundColor: '#fee2e2' },
                                        }}
                                    >
                                        <FaTrash style={{ fontSize: '14px' }} />
                                    </IconButton>
                                )}
                            </Stack>
                        </Box>
                    ))
                ) : (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 6,
                            color: 'text.secondary',
                        }}
                    >
                        <FaFileAlt style={{ fontSize: '48px', opacity: 0.3, marginBottom: '16px' }} />
                        <Typography variant="body2" color="text.secondary">
                            No attachments yet
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Click the + button to upload files
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};
