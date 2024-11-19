import React, { useState } from 'react';
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
  IconButton,
  Popover,
  Paper,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CreateIcon from '@mui/icons-material/Create';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { AIService } from '../../services/AIService';
import { useAIStore } from '../../stores/aiStore';
import { LordIcon } from '../common/LordIcon';

interface QuickActionBarProps {
  onFormatText: (format: string) => void;
  onAIAction: (text: string, result: string) => void;
  getSelectedText: () => string;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({
  onFormatText,
  onAIAction,
  getSelectedText,
}) => {
  const [open, setOpen] = useState(false);
  const [isClickOpen, setIsClickOpen] = useState(false);
  const [aiMenuAnchor, setAiMenuAnchor] = useState<null | HTMLElement>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const { activeProvider } = useAIStore();

  const handleAIAction = async (action: string, customInput: string = '') => {
    if (!activeProvider) {
      alert('Please configure an AI provider in your profile settings first.');
      return;
    }

    const selectedText = getSelectedText();
    if (!selectedText) {
      alert('Please select some text first.');
      return;
    }

    const aiService = new AIService(activeProvider);
    let result = '';

    try {
      switch (action) {
        case 'improve':
          result = await aiService.improveText(selectedText, 'Make this text more engaging and professional');
          break;
        case 'continue':
          result = await aiService.suggestContinuation(selectedText);
          break;
        case 'brainstorm':
          result = await aiService.brainstorm(selectedText);
          break;
        case 'custom':
          if (!customInput) return;
          result = await aiService.improveText(selectedText, customInput);
          break;
        default:
          return;
      }
      onAIAction(selectedText, result);
    } catch (error) {
      console.error('AI action failed:', error);
      alert('Failed to process AI action. Please try again.');
    }
  };

  const formatActions = [
    { icon: <FormatBoldIcon />, name: 'Bold', action: 'bold' },
    { icon: <FormatItalicIcon />, name: 'Italic', action: 'italic' },
    { icon: <FormatListBulletedIcon />, name: 'Bullet List', action: 'bullet' },
    { icon: <FormatListNumberedIcon />, name: 'Numbered List', action: 'number' },
  ];

  const aiActions = [
    { icon: <AutoFixHighIcon />, name: 'Improve Writing', action: 'improve' },
    { icon: <CreateIcon />, name: 'Continue Writing', action: 'continue' },
    { icon: <LightbulbIcon />, name: 'Brainstorm Ideas', action: 'brainstorm' },
    { icon: <PsychologyIcon />, name: 'Custom Prompt', action: 'custom' },
  ];

  const handleCustomPrompt = () => {
    if (customPrompt.trim()) {
      handleAIAction('custom', customPrompt);
      setCustomPrompt('');
      setAiMenuAnchor(null);
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
      {/* Custom Prompt Popover */}
      <Popover
        open={Boolean(aiMenuAnchor)}
        anchorEl={aiMenuAnchor}
        onClose={() => setAiMenuAnchor(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ p: 2, maxWidth: 400 }}>
          <Typography variant="subtitle1" gutterBottom>
            Custom AI Prompt
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter your prompt for the AI..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
          <Tooltip title={customPrompt.trim() ? '' : 'Please enter a prompt'}>
            <span>
              <Button
                fullWidth
                variant="contained"
                onClick={handleCustomPrompt}
                disabled={!customPrompt.trim()}
              >
                Apply
              </Button>
            </span>
          </Tooltip>
        </Paper>
      </Popover>

      {/* Main Speed Dial */}
      <SpeedDial
        ariaLabel="Quick Actions"
        icon={
          <SpeedDialIcon 
            icon={
              <LordIcon
                src="https://cdn.lordicon.com/wloilxuq.json"
                trigger="hover"
                size={23}
                colors={{
                  primary: "#808080",
                  secondary: "#121331"
                }}
              />
            }
          />
        }
        open={open || isClickOpen}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onClick={() => setIsClickOpen(!isClickOpen)}
        onMouseLeave={() => setOpen(false)}
      >
        {formatActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => onFormatText(action.action)}
            disabled={!getSelectedText()}
          />
        ))}
        {aiActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={(e) =>
              action.action === 'custom'
                ? setAiMenuAnchor(e.currentTarget)
                : handleAIAction(action.action)
            }
            disabled={!getSelectedText() || !activeProvider}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default QuickActionBar;
