import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Chip, Paper } from '@mui/material';
import { FaUpload, FaTrash, FaFile, FaFilePdf, FaFileImage, FaFileWord } from 'react-icons/fa';
import { FIELD_BOX_STYLES, FIELD_LABEL_STYLES } from '../../styles/UIStyles';

export interface UploadedFile {
    id?: string;
    name: string;
    size?: number;
    url?: string;
    file?: File;
    isNew?: boolean;
}

interface Props {
    label: string;
    value: UploadedFile[];
    onChange: (files: UploadedFile[]) => void;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
    accept?: string;
    maxFiles?: number;
    maxSizeInMB?: number;
}

export const IMultiFileUpload: React.FC<Props> = ({
    label,
    value = [],
    onChange,
    error,
    disabled = false,
    placeholder = 'Click to upload or drag and drop files',
    accept = 'image/*,application/pdf,.doc,.docx,.xls,.xlsx',
    maxFiles = 10,
    maxSizeInMB = 10,
}) => {
    const [dragActive, setDragActive] = useState(false);

    const getFileIcon = (fileName: string) => {
        if (!fileName) return <FaFile style={{ color: '#6b7280' }} />;

        const ext = fileName.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'pdf':
                return <FaFilePdf style={{ color: '#ef4444' }} />;
            case 'doc':
            case 'docx':
                return <FaFileWord style={{ color: '#3b82f6' }} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp':
                return <FaFileImage style={{ color: '#10b981' }} />;
            default:
                return <FaFile style={{ color: '#6b7280' }} />;
        }
    };

    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleFileSelect = (files: FileList | null) => {
        if (!files || disabled) return;

        const newFiles: UploadedFile[] = [];
        const maxSizeBytes = maxSizeInMB * 1024 * 1024;

        Array.from(files).forEach((file) => {
            // Check file size
            if (file.size > maxSizeBytes) {
                alert(`File "${file.name}" is too large. Maximum size is ${maxSizeInMB}MB.`);
                return;
            }

            // Check max files limit
            if (value.length + newFiles.length >= maxFiles) {
                alert(`Maximum ${maxFiles} files allowed.`);
                return;
            }

            newFiles.push({
                name: file.name,
                size: file.size,
                file: file,
                isNew: true,
            });
        });

        if (newFiles.length > 0) {
            onChange([...value, ...newFiles]);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(event.target.files);
        // Reset input so the same file can be selected again
        event.target.value = '';
    };

    const handleRemoveFile = (index: number) => {
        if (disabled) return;
        const newFiles = value.filter((_, i) => i !== index);
        onChange(newFiles);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    return (
        <Box sx={FIELD_BOX_STYLES}>
            <Typography sx={FIELD_LABEL_STYLES}>{label}</Typography>

            {/* Upload Area */}
            <Box
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                sx={{
                    border: dragActive ? '2px dashed #667eea' : '2px dashed #e5e7eb',
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: dragActive ? '#f0f4ff' : '#f9fafb',
                    transition: 'all 0.2s ease',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.6 : 1,
                    '&:hover': !disabled
                        ? {
                              borderColor: '#667eea',
                              backgroundColor: '#f0f4ff',
                          }
                        : {},
                }}
            >
                <FaUpload
                    style={{
                        fontSize: '32px',
                        color: dragActive ? '#667eea' : '#9ca3af',
                        marginBottom: '12px',
                    }}
                />
                <Typography
                    sx={{
                        fontSize: '14px',
                        color: '#6b7280',
                        mb: 1,
                    }}
                >
                    {placeholder}
                </Typography>
                <Button
                    component="label"
                    variant="outlined"
                    disabled={disabled || value.length >= maxFiles}
                    sx={{
                        textTransform: 'none',
                        borderColor: '#e5e7eb',
                        color: '#374151',
                        '&:hover': {
                            borderColor: '#667eea',
                            backgroundColor: '#f0f4ff',
                        },
                    }}
                >
                    Choose Files
                    <input
                        hidden
                        accept={accept}
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        disabled={disabled}
                    />
                </Button>
                <Typography
                    sx={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        mt: 1,
                    }}
                >
                    Maximum {maxFiles} files, {maxSizeInMB}MB each
                </Typography>
            </Box>

            {/* Files List */}
            {value.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#374151',
                            mb: 1,
                        }}
                    >
                        Uploaded Files ({value.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {value.map((file, index) => (
                            <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    backgroundColor: '#ffffff',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: '#d1d5db',
                                        backgroundColor: '#f9fafb',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                    <Box sx={{ fontSize: '20px' }}>{getFileIcon(file.name)}</Box>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            sx={{
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                color: '#111827',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {file.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                                            {file.size && (
                                                <Typography
                                                    sx={{
                                                        fontSize: '12px',
                                                        color: '#6b7280',
                                                    }}
                                                >
                                                    {formatFileSize(file.size)}
                                                </Typography>
                                            )}
                                            {file.isNew && (
                                                <Chip
                                                    label="New"
                                                    size="small"
                                                    sx={{
                                                        height: '18px',
                                                        fontSize: '11px',
                                                        backgroundColor: '#dbeafe',
                                                        color: '#1e40af',
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                                <IconButton
                                    onClick={() => handleRemoveFile(index)}
                                    disabled={disabled}
                                    size="small"
                                    sx={{
                                        color: '#ef4444',
                                        '&:hover': {
                                            backgroundColor: '#fee2e2',
                                        },
                                    }}
                                >
                                    <FaTrash size={14} />
                                </IconButton>
                            </Paper>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Error Message */}
            {error && (
                <Typography
                    sx={{
                        fontSize: '12px',
                        color: '#ef4444',
                        mt: 1,
                        ml: 1,
                    }}
                >
                    {error}
                </Typography>
            )}
        </Box>
    );
};
