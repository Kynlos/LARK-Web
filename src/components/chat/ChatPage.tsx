import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
    Box,
    TextField,
    IconButton,
    Paper,
    Typography,
    Stack,
    Slider,
    Button,
    Tooltip,
    Divider,
    Autocomplete,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    List,
    ListItemButton,
    ListItemText,
    InputAdornment
} from '@mui/material';
import {
    Send as SendIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Settings as SettingsIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { AIService } from '../../services/AIService';
import { useChatStore } from '../../stores/chatStore';
import { FileSidebar } from './FileSidebar';
import { useEditorStore } from '../../stores/editorStore';
import { useAIStore } from '../../stores/aiStore';
import styled from '@mui/material/styles/styled';

const DRAWER_WIDTH = 280; // Match MainLayout drawer width
const FILE_SIDEBAR_WIDTH = 250; // File sidebar width
const NAVBAR_HEIGHT = 64; // MUI's default AppBar height

const ChatPageContainer = styled('div')({
    position: 'absolute',
    top: NAVBAR_HEIGHT,
    left: DRAWER_WIDTH,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});

const ChatControls = styled('div')({
    padding: '8px 16px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: '#fff',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexShrink: 0,
    zIndex: 10,
});

const SettingsPanel = styled('div')({
    padding: '16px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: '#fff',
    flexShrink: 0,
    zIndex: 10,
});

const ChatList = styled('div')({
    display: 'flex',
    gap: '8px',
    flexGrow: 1,
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
        height: '4px',
    },
});

const ChatContainer = styled('div')({
    position: 'relative',
    display: 'flex',
    flexGrow: 1,
    minHeight: 0,
    width: `calc(100% - ${FILE_SIDEBAR_WIDTH}px)`,
});

const MessagesContainer = styled('div')({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minHeight: 0,
});

const MessagesList = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 80, // Leave space for input container
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
});

const InputContainer = styled('div')({
    position: 'fixed',
    left: DRAWER_WIDTH,
    bottom: 0,
    width: `calc(100% - ${DRAWER_WIDTH + FILE_SIDEBAR_WIDTH}px)`,
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    padding: '16px',
    backgroundColor: '#fff',
    zIndex: 100,
    height: 80,
});

const SidebarContainer = styled('div')({
    width: FILE_SIDEBAR_WIDTH,
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    position: 'fixed',
    top: NAVBAR_HEIGHT,
    right: 0,
    bottom: 0,
    zIndex: 1,
});

const ChatTab = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px',
    borderRadius: '4px',
    '&:hover .rename-actions': {
        opacity: 1,
    },
});

const RenameActions = styled('div')({
    opacity: 0,
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
});

interface FileReference {
    path: string;
    startLine?: number;
    endLine?: number;
}

interface Message {
    content: string;
    sender: 'user' | 'ai';
    fileRefs?: FileReference[];
}

const MessageBubble = React.memo(({ message }: { message: Message }) => {
    const { openFile } = useEditorStore();

    const handleFileClick = (ref: FileReference) => {
        openFile(ref.path);
    };

    const renderContent = () => {
        if (!message.fileRefs?.length) {
            return <Typography>{message.content}</Typography>;
        }

        let lastIndex = 0;
        const parts = [];
        const regex = /@([^:\s]+)(?::(\d+)-(\d+))?/g;
        let match;

        while ((match = regex.exec(message.content)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
                parts.push(
                    <Typography key={`text-${lastIndex}`} component="span">
                        {message.content.slice(lastIndex, match.index)}
                    </Typography>
                );
            }

            // Add the file reference as a link
            const ref = message.fileRefs.find(r => r.path === match[1]);
            if (ref) {
                parts.push(
                    <Button
                        key={`ref-${match.index}`}
                        onClick={() => handleFileClick(ref)}
                        sx={{ textTransform: 'none', p: 0, mx: 0.5 }}
                    >
                        {match[0]}
                    </Button>
                );
            }

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < message.content.length) {
            parts.push(
                <Typography key={`text-${lastIndex}`} component="span">
                    {message.content.slice(lastIndex)}
                </Typography>
            );
        }

        return <Box sx={{ display: 'inline' }}>{parts}</Box>;
    };

    return (
        <Box
            sx={{
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
            }}
        >
            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    backgroundColor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                    borderRadius: 2,
                }}
            >
                {renderContent()}
            </Paper>
        </Box>
    );
});

export const ChatPage: React.FC = () => {
    const {
        chats,
        activeChat,
        settings,
        addChat,
        addMessage,
        deleteChat,
        updateSettings,
        renameChat,
        setActiveChat
    } = useChatStore();
    const { settings: aiSettings } = useAIStore();
    const { openFiles, openFile } = useEditorStore();
    
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [showSettings, setShowSettings] = React.useState(false);
    const [editingChatId, setEditingChatId] = React.useState<string | null>(null);
    const [editTitle, setEditTitle] = React.useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<string | null>(null);
    const currentChat = chats.find(chat => chat.id === activeChat);
    const aiService = useMemo(() => {
        const service = AIService.getInstance();
        const provider = aiSettings.providers.find(p => p.name === aiSettings.activeProvider);
        if (provider) {
            service.setProvider(provider);
        }
        return service;
    }, [aiSettings]);

    useEffect(() => {
        if (!activeChat && chats.length === 0) {
            addChat();
        } else if (!activeChat && chats.length > 0) {
            setActiveChat(chats[0].id);
        }
    }, [activeChat, chats, addChat, setActiveChat]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentChat?.messages]);

    const [fileSuggestions, setFileSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFileSelect = (path: string, startLine?: number, endLine?: number) => {
        let reference = `@${path}`;
        if (startLine !== undefined && endLine !== undefined) {
            reference += `:${startLine}-${endLine}`;
        }
        setInput(prev => `${prev}${prev.length > 0 ? ' ' : ''}${reference}`);
        inputRef.current?.focus();
    };

    const handleSend = async () => {
        if (!input.trim() || !activeChat) return;

        // Parse file references in the message
        const fileRefs: FileReference[] = [];
        const regex = /@([^:\s]+)(?::(\d+)-(\d+))?/g;
        let match;
        while ((match = regex.exec(input)) !== null) {
            const [, path, startLine, endLine] = match;
            fileRefs.push({
                path,
                startLine: startLine ? parseInt(startLine, 10) : undefined,
                endLine: endLine ? parseInt(endLine, 10) : undefined
            });
        }

        const userMessage = {
            content: input,
            sender: 'user' as const,
            fileRefs
        };

        addMessage(activeChat, userMessage);
        setInput('');
        setIsLoading(true);

        try {
            const response = await aiService.chat({
                message: input,
                previousMessages: currentChat?.messages.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.content
                }))
            });

            addMessage(activeChat, {
                content: response.message,
                sender: 'ai'
            });
        } catch (error) {
            console.error('Error sending message:', error);
            addMessage(activeChat, {
                content: 'Sorry, there was an error processing your message.',
                sender: 'ai'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);

        // Handle @ mentions
        const lastAtIndex = value.lastIndexOf('@');
        if (lastAtIndex !== -1) {
            const query = value.slice(lastAtIndex + 1).toLowerCase();
            const suggestions = openFiles.filter(file => 
                file.toLowerCase().includes(query)
            );
            setFileSuggestions(suggestions);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (file: string) => {
        const lastAtIndex = input.lastIndexOf('@');
        const newInput = input.slice(0, lastAtIndex) + '@' + file;
        setInput(newInput);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleStartRename = (chat: { id: string, title: string }) => {
        setEditingChatId(chat.id);
        setEditTitle(chat.title);
    };

    const handleFinishRename = () => {
        if (editingChatId && editTitle.trim()) {
            renameChat(editingChatId, editTitle.trim());
        }
        setEditingChatId(null);
        setEditTitle('');
    };

    const handleRenameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleFinishRename();
        } else if (e.key === 'Escape') {
            setEditingChatId(null);
            setEditTitle('');
        }
    };

    const handleDeleteClick = (chatId: string) => {
        setChatToDelete(chatId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (chatToDelete) {
            deleteChat(chatToDelete);
        }
        setDeleteDialogOpen(false);
        setChatToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setChatToDelete(null);
    };

    const renderSuggestions = () => {
        if (!showSuggestions || fileSuggestions.length === 0) return null;

        return (
            <Paper
                ref={suggestionsRef}
                sx={{
                    position: 'absolute',
                    bottom: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '200px',
                    overflow: 'auto',
                    zIndex: 1000,
                    mt: 1,
                    mb: 1
                }}
            >
                <List>
                    {fileSuggestions.map((file, index) => (
                        <ListItemButton
                            key={file}
                            onClick={() => handleSuggestionClick(file)}
                            dense
                        >
                            <ListItemText 
                                primary={file.split('/').pop()}
                                secondary={file}
                                secondaryTypographyProps={{
                                    sx: { 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }
                                }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Paper>
        );
    };

    return (
        <ChatPageContainer>
            <ChatControls>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={addChat}
                >
                    New Chat
                </Button>
                
                <ChatList>
                    {chats.map((chat) => (
                        <ChatTab key={chat.id}>
                            {editingChatId === chat.id ? (
                                <TextField
                                    size="small"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onBlur={handleFinishRename}
                                    onKeyDown={handleRenameKeyDown}
                                    autoFocus
                                    sx={{ width: '150px' }}
                                />
                            ) : (
                                <Button
                                    variant={chat.id === activeChat ? "contained" : "outlined"}
                                    onClick={() => setActiveChat(chat.id)}
                                    size="small"
                                >
                                    {chat.title || `Chat ${chat.id.slice(0, 8)}`}
                                </Button>
                            )}
                            
                            <RenameActions className="rename-actions">
                                {chat.id === activeChat && !editingChatId && (
                                    <>
                                        <Tooltip title="Rename chat" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStartRename(chat);
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete chat" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(chat.id);
                                                }}
                                                color="error"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )}
                            </RenameActions>
                        </ChatTab>
                    ))}
                </ChatList>

                <IconButton 
                    onClick={() => setShowSettings(!showSettings)}
                    color={showSettings ? "primary" : "default"}
                >
                    <SettingsIcon />
                </IconButton>
            </ChatControls>
            
            {showSettings && (
                <SettingsPanel>
                    <Stack spacing={3}>
                        <Box>
                            <Typography gutterBottom>Temperature: {settings.temperature}</Typography>
                            <Slider
                                value={settings.temperature}
                                min={0}
                                max={1}
                                step={0.1}
                                onChange={(_, value) => updateSettings({ temperature: value as number })}
                                sx={{ width: 200 }}
                            />
                        </Box>
                        
                        <Box>
                            <Typography gutterBottom>Max Tokens: {settings.maxTokens}</Typography>
                            <Slider
                                value={settings.maxTokens}
                                min={100}
                                max={4000}
                                step={100}
                                onChange={(_, value) => updateSettings({ maxTokens: value as number })}
                                sx={{ width: 200 }}
                            />
                        </Box>
                        
                        <Box>
                            <Typography gutterBottom>Model: {settings.model}</Typography>
                            <Select
                                value={settings.model}
                                onChange={(e) => updateSettings({ model: e.target.value })}
                                size="small"
                                sx={{ width: 200 }}
                            >
                                <MenuItem value="llama3-8b-8192">LLaMA 3 (8B)</MenuItem>
                                <MenuItem value="llama3-13b-8192">LLaMA 3 (13B)</MenuItem>
                            </Select>
                        </Box>
                    </Stack>
                </SettingsPanel>
            )}
            
            <ChatContainer>
                <MessagesContainer>
                    <MessagesList ref={messagesEndRef}>
                        {currentChat?.messages.map((message, index) => (
                            <MessageBubble key={`${message.id}-${index}`} message={message} />
                        ))}
                    </MessagesList>
                </MessagesContainer>
            </ChatContainer>
            
            <SidebarContainer>
                <FileSidebar onFileSelect={handleFileSelect} />
            </SidebarContainer>
            
            <InputContainer>
                <Box sx={{ position: 'relative' }}>
                    {renderSuggestions()}
                    <TextField
                        fullWidth
                        placeholder="Type your message..."
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        inputRef={inputRef}
                        disabled={isLoading}
                        multiline={false}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleSend}
                                        disabled={isLoading || !input.trim()}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </InputContainer>
            
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete Chat
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this chat? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </ChatPageContainer>
    );
};
