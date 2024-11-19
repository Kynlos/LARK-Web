import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  styled,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Close,
  MoreVert,
  Save,
  SaveAlt as SaveAll,
  Cancel as CloseCircle
} from '@mui/icons-material';
import { useEditorStore } from '../../stores/editorStore';
import { EditorFile } from '../../core/types/editor';

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 35,
  padding: '0 16px',
  minWidth: 100,
  maxWidth: 200,
  position: 'relative',
  textTransform: 'none',
  flexDirection: 'row',
  justifyContent: 'flex-start',
}));

const CloseIcon = styled(Close)(({ theme }) => ({
  fontSize: '0.8rem',
  cursor: 'pointer',
  position: 'absolute',
  right: 2,
  top: '50%',
  transform: 'translateY(-50%)',
  '&:hover': {
    color: theme.palette.error.main,
  },
}));

export const TabBar = () => {
  const {
    openFiles: openFileIds,
    files,
    activeFile,
    closeFile,
    switchToFile,
    saveFile,
    saveAllFiles,
    isDirty
  } = useEditorStore();

  const openFiles = React.useMemo(() => {
    return openFileIds.map(id => files.find(f => f.id === id)).filter((f): f is EditorFile => f !== undefined);
  }, [openFileIds, files]);

  const [moreMenuAnchor, setMoreMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [selectedTab, setSelectedTab] = React.useState<EditorFile | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    switchToFile(newValue);
  };

  const handleCloseTab = (event: React.MouseEvent, fileId: string) => {
    event.stopPropagation();
    closeFile(fileId);
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>, file: EditorFile) => {
    event.stopPropagation();
    setSelectedTab(file);
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMoreClose = () => {
    setMoreMenuAnchor(null);
    setSelectedTab(null);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tabs
          value={activeFile?.id || false}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ flex: 1, minHeight: 35 }}
        >
          {openFiles.map((file) => (
            <StyledTab
              key={file.id}
              value={file.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                  {file.name}
                  {isDirty(file.id) && '*'}
                  <CloseIcon
                    onClick={(e) => handleCloseTab(e, file.id)}
                  />
                </Box>
              }
            />
          ))}
        </Tabs>
        <Box sx={{ display: 'flex', borderLeft: 1, borderColor: 'divider' }}>
          <IconButton
            size="small"
            onClick={() => activeFile && saveFile(activeFile.id)}
          >
            <Save fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={saveAllFiles}>
            <SaveAll fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => activeFile && handleMoreClick(e, activeFile)}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={moreMenuAnchor}
        open={Boolean(moreMenuAnchor)}
        onClose={handleMoreClose}
      >
        {selectedTab && (
          <>
            <MenuItem
              onClick={() => {
                if (selectedTab) {
                  saveFile(selectedTab.id);
                }
                handleMoreClose();
              }}
            >
              <ListItemIcon>
                <Save fontSize="small" />
              </ListItemIcon>
              <ListItemText>Save</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              saveAllFiles();
              handleMoreClose();
            }}>
              <ListItemIcon>
                <SaveAll fontSize="small" />
              </ListItemIcon>
              <ListItemText>Save All</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (selectedTab) {
                  closeFile(selectedTab.id);
                }
                handleMoreClose();
              }}
            >
              <ListItemIcon>
                <CloseCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>Close</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};
