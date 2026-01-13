import React from 'react';
import {
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Stack,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
    Divider,
} from '@mui/material';
import { FaTrash, FaStickyNote, FaPaperPlane } from 'react-icons/fa';
import FormateTime from '../../../utils/formateTime';

interface Props {
    comments: any[];
    note: string;
    onNoteChange: (note: string) => void;
    onSendNote: () => void;
    onDeleteNote?: (commentId: string) => void;
}

export const NotesCard: React.FC<Props> = ({ comments, note, onNoteChange, onSendNote, onDeleteNote }) => {
    const MAX_NOTE_LENGTH = 255;
    const remainingChars = MAX_NOTE_LENGTH - note.length;
    const isNearLimit = remainingChars <= 50;
    const isOverLimit = remainingChars < 0;

    return (
        <Paper
            elevation={0}
            sx={{
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: 'white',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 3,
                    py: 2.5,
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    borderBottom: '1px solid #e5e7eb',
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        }}
                    >
                        <FaStickyNote style={{ color: 'white', fontSize: '16px' }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight={700} color="#1a3353">
                            Notes
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {comments.length} {comments.length === 1 ? 'note' : 'notes'}
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Comments List */}
            <Box
                sx={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    px: 3,
                    py: 2,
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f1f5f9',
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#cbd5e1',
                        borderRadius: '10px',
                        '&:hover': {
                            backgroundColor: '#94a3b8',
                        },
                    },
                }}
            >
                {comments.length > 0 ? (
                    <List disablePadding>
                        {comments.map((comment: any, index: number) => (
                            <React.Fragment key={comment.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    disablePadding
                                    sx={{
                                        py: 2,
                                        position: 'relative',
                                        '&:hover': {
                                            '& .delete-button': {
                                                opacity: 1,
                                            },
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={comment.commented_by?.first_name}
                                            src={comment.commented_by?.user_details?.profile_pic}
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                border: '3px solid #f8fafc',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                            }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{ pr: 2 }}
                                        primary={
                                            <Box>
                                                <Stack direction="row" spacing={0.5} alignItems="center" mb={0.5}>
                                                    <Typography variant="body2" fontWeight={700} color="#1a3353">
                                                        {comment.commented_by?.first_name &&
                                                        comment.commented_by?.last_name
                                                            ? `${comment.commented_by.first_name} ${comment.commented_by.last_name}`
                                                            : 'Unknown User'}
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            width: 4,
                                                            height: 4,
                                                            borderRadius: '50%',
                                                            backgroundColor: '#cbd5e1',
                                                        }}
                                                    />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {FormateTime(comment.commented_on)}
                                                    </Typography>
                                                </Stack>
                                                <Typography
                                                    variant="body2"
                                                    color="text.primary"
                                                    sx={{
                                                        lineHeight: 1.6,
                                                        whiteSpace: 'pre-wrap',
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {comment.comment}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                    {onDeleteNote && (
                                        <IconButton
                                            className="delete-button"
                                            size="small"
                                            onClick={() => onDeleteNote(comment.id)}
                                            sx={{
                                                position: 'absolute',
                                                top: 16,
                                                right: 0,
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                                color: '#ef4444',
                                                '&:hover': {
                                                    backgroundColor: '#fee2e2',
                                                },
                                            }}
                                        >
                                            <FaTrash style={{ fontSize: '12px' }} />
                                        </IconButton>
                                    )}
                                </ListItem>
                                {index !== comments.length - 1 && <Divider sx={{ my: 0 }} />}
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                        }}
                    >
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                backgroundColor: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                mb: 2,
                            }}
                        >
                            <FaStickyNote style={{ fontSize: '24px', color: '#cbd5e1' }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={600} mb={0.5}>
                            No notes yet
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Start the conversation by adding a note below
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Add Note Section */}
            <Box
                sx={{
                    px: 3,
                    pb: 3,
                    pt: 2,
                    borderTop: '1px solid #f1f5f9',
                    backgroundColor: '#fafbfc',
                }}
            >
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Write a note..."
                    value={note}
                    onChange={(e) => {
                        if (e.target.value.length <= MAX_NOTE_LENGTH) {
                            onNoteChange(e.target.value);
                        }
                    }}
                    error={isOverLimit}
                    helperText={
                        note.length > 0 && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: isOverLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : '#94a3b8',
                                    fontWeight: 600,
                                }}
                            >
                                {remainingChars} characters remaining
                            </Typography>
                        )
                    }
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            '&:hover': {
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isOverLimit ? '#ef4444' : '#667eea',
                                },
                            },
                            '&.Mui-focused': {
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isOverLimit ? '#ef4444' : '#667eea',
                                    borderWidth: '2px',
                                },
                            },
                        },
                    }}
                />
                <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                    <Button
                        size="small"
                        onClick={() => onNoteChange('')}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            color: '#64748b',
                            px: 2.5,
                            '&:hover': {
                                backgroundColor: '#f1f5f9',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={onSendNote}
                        disabled={!note.trim() || isOverLimit}
                        startIcon={<FaPaperPlane style={{ fontSize: '12px' }} />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 3,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                            },
                            '&:disabled': {
                                background: '#e2e8f0',
                                color: '#94a3b8',
                            },
                        }}
                    >
                        Send Note
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};
