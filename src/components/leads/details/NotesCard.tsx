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
} from '@mui/material';
import FormateTime from '../../FormateTime';

interface Props {
    comments: any[];
    note: string;
    onNoteChange: (note: string) => void;
    onSendNote: () => void;
}

export const NotesCard: React.FC<Props> = ({ comments, note, onNoteChange, onSendNote }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: '#fafafa',
            }}
        >
            <Typography variant="h6" fontWeight={600} color="#1a3353" mb={2}>
                Notes
            </Typography>

            {/* Comments List */}
            <Box
                sx={{
                    maxHeight: '350px',
                    overflowY: 'auto',
                    mb: 2,
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    p: 2,
                }}
            >
                {comments.length > 0 ? (
                    <List disablePadding>
                        {comments.map((comment: any, index: number) => (
                            <ListItem key={index} alignItems="flex-start" disablePadding sx={{ mb: 2 }}>
                                <ListItemAvatar>
                                    <Avatar sx={{ width: 32, height: 32 }} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" fontWeight={500}>
                                            {comment.comment}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="text.secondary">
                                            {FormateTime(comment.commented_on)}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                        No notes yet
                    </Typography>
                )}
            </Box>

            {/* Add Note */}
            <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a note..."
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '8px',
                    },
                }}
            />
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Button size="small" onClick={() => onNoteChange('')} sx={{ textTransform: 'none' }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    onClick={onSendNote}
                    disabled={!note.trim()}
                    sx={{
                        textTransform: 'none',
                        backgroundColor: '#6366f1',
                        '&:hover': { backgroundColor: '#4f46e5' },
                    }}
                >
                    Send
                </Button>
            </Stack>
        </Paper>
    );
};
