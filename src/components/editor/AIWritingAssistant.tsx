import React, { useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    Tooltip,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    CircularProgress,
} from '@mui/material';
import {
    AutoFixHigh as ImproveIcon,
    PlayArrow as ContinueIcon,
    Lightbulb as IdeasIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useAIStore } from '../../stores/aiStore';
import { AIService } from '../../services/AIService';

interface AIWritingAssistantProps {
    selectedText: string;
    onInsertText: (text: string) => void;
    onReplaceText: (text: string) => void;
}

export const AIWritingAssistant: React.FC<AIWritingAssistantProps> = ({
    selectedText,
    onInsertText,
    onReplaceText,
}) => {
    const { isConfigured } = useAIStore();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSuggestions([]);
        setError('');
    };

    const handleImprove = async () => {
        if (!selectedText) {
            setError('Please select some text to improve');
            return;
        }

        setIsLoading(true);
        setDialogTitle('Improved Writing Suggestions');
        setIsDialogOpen(true);
        handleClose();

        try {
            const improved = await AIService.getInstance().improveWriting(selectedText);
            setSuggestions([improved]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get suggestions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = async () => {
        setIsLoading(true);
        setDialogTitle('Suggested Continuations');
        setIsDialogOpen(true);
        handleClose();

        try {
            const continuation = await AIService.getInstance().suggestContinuation(selectedText);
            setSuggestions([continuation]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get suggestions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBrainstorm = async () => {
        if (!selectedText) {
            setError('Please select a topic or theme to brainstorm about');
            return;
        }

        setIsLoading(true);
        setDialogTitle('Brainstorming Ideas');
        setIsDialogOpen(true);
        handleClose();

        try {
            const ideas = await AIService.getInstance().brainstormIdeas(selectedText);
            setSuggestions(ideas);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get suggestions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplySuggestion = (text: string) => {
        if (dialogTitle === 'Improved Writing Suggestions') {
            onReplaceText(text);
        } else {
            onInsertText(text);
        }
        handleDialogClose();
    };

    if (!isConfigured) {
        return null;
    }

    return (
        <>
            <Box sx={{ position: 'absolute', right: 16, top: 16, zIndex: 1 }}>
                <Tooltip title="AI Writing Assistant">
                    <IconButton
                        onClick={handleClick}
                        color="primary"
                        sx={{
                            backgroundColor: 'background.paper',
                            boxShadow: 1,
                            '&:hover': { backgroundColor: 'background.paper' },
                        }}
                    >
                        <AutoFixHigh />
                    </IconButton>
                </Tooltip>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleImprove}>
                    <ImproveIcon sx={{ mr: 1 }} /> Improve Writing
                </MenuItem>
                <MenuItem onClick={handleContinue}>
                    <ContinueIcon sx={{ mr: 1 }} /> Suggest Continuation
                </MenuItem>
                <MenuItem onClick={handleBrainstorm}>
                    <IdeasIcon sx={{ mr: 1 }} /> Brainstorm Ideas
                </MenuItem>
            </Menu>

            <Dialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {dialogTitle}
                        <IconButton onClick={handleDialogClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        suggestions.map((suggestion, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                                onClick={() => handleApplySuggestion(suggestion)}
                            >
                                <Typography>{suggestion}</Typography>
                            </Box>
                        ))
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
