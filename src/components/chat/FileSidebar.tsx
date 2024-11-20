import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography, IconButton, Tooltip, TextField, Tab, Tabs } from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { useEditorStore } from '../../stores/editorStore';

interface FileSidebarProps {
    onFileSelect: (path: string, startLine?: number, endLine?: number) => void;
}

export const FileSidebar: React.FC<FileSidebarProps> = ({ onFileSelect }) => {
    const { openFiles, recentFiles, activeFile } = useEditorStore();
    const [activeTab, setActiveTab] = useState(0);
    const [lineRange, setLineRange] = useState<string>('');

    const handleFileClick = (path: string) => {
        if (lineRange) {
            const [start, end] = lineRange.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
                onFileSelect(path, start, end);
                setLineRange('');
                return;
            }
        }
        onFileSelect(path);
    };

    const handleCopyReference = (path: string) => {
        let reference = `@${path}`;
        if (lineRange) {
            const [start, end] = lineRange.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
                reference += `:${start}-${end}`;
            }
        }
        navigator.clipboard.writeText(reference);
    };

    const renderFileList = (files: string[]) => (
        <List sx={{ flex: 1, overflow: 'auto' }}>
            {files.map((file) => (
                <ListItem
                    key={file}
                    disablePadding
                    secondaryAction={
                        <Tooltip title="Copy file reference">
                            <span>
                                <IconButton 
                                    edge="end" 
                                    onClick={() => handleCopyReference(file)}
                                    size="small"
                                >
                                    <ContentCopyIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    }
                    sx={{
                        backgroundColor: activeFile === file ? 'action.selected' : 'inherit'
                    }}
                >
                    <ListItemButton 
                        onClick={() => handleFileClick(file)}
                        sx={{ pr: 7 }}
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
                </ListItem>
            ))}
            {files.length === 0 && (
                <ListItem>
                    <ListItemText 
                        primary="No files"
                        secondary={activeTab === 0 ? "Open some files to see them here" : "Recent files will appear here"}
                    />
                </ListItem>
            )}
        </List>
    );

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                Files
            </Typography>
            
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <TextField
                    size="small"
                    fullWidth
                    label="Line Range (e.g., 1-10)"
                    value={lineRange}
                    onChange={(e) => setLineRange(e.target.value)}
                    placeholder="Optional: 1-10"
                />
            </Box>

            <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label="Open Files" />
                <Tab label="Recent" />
            </Tabs>

            {activeTab === 0 ? renderFileList(openFiles) : renderFileList(recentFiles)}
        </Box>
    );
};
