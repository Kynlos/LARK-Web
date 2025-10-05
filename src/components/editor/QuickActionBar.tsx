import React, { useState } from 'react';
import {
  Box,
  Popover,
  Paper,
  Typography,
  TextField,
  Button,
  Tooltip,
  IconButton,
  Stack,
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
  const { settings } = useAIStore();
  const [aiMenuAnchor, setAiMenuAnchor] = useState<null | HTMLElement>(null);
  const [customPrompt, setCustomPrompt] = useState('');

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

  const handleAIAction = async (action: string, customInput: string = '') => {
    const activeProvider = settings.providers.find(p => p.name === settings.activeProvider);
    
    if (!activeProvider) {
      alert('Please configure an AI provider in your profile settings first.');
      return;
    }

    const selectedText = getSelectedText();
    if (!selectedText) {
      alert('Please select some text first.');
      return;
    }

    const aiService = AIService.getInstance();
    aiService.setProvider(activeProvider);
    let result = '';

    try {
      switch (action) {
        case 'improve':
          result = await aiService.improveWriting(selectedText);
          break;
        case 'continue':
          result = await aiService.suggestContinuation(selectedText);
          break;
        case 'brainstorm':
          const ideas = await aiService.brainstormIdeas(selectedText);
          result = ideas.join('\n');
          break;
        case 'custom':
          if (!customInput) return;
          result = await aiService.getChatCompletion({
            messages: [
              { role: 'system', content: 'You are a professional writing assistant.' },
              { role: 'user', content: `${customInput}\n\nText: ${selectedText}` }
            ]
          }).then(res => res.message.content);
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
          <Button
            fullWidth
            variant="contained"
            onClick={handleCustomPrompt}
            disabled={!customPrompt.trim()}
          >
            Apply
          </Button>
        </Paper>
      </Popover>

      {/* Action Buttons */}
      <Paper elevation={3} sx={{ p: 1, borderRadius: 2 }}>
        <Stack direction="row" spacing={1}>
          {formatActions.map((action) => {
            const disabled = !getSelectedText();
            return (
              <Tooltip
                key={action.name}
                title={disabled ? 'Please select text first' : action.name}
                disableHoverListener={disabled}
              >
                <span>
                  <IconButton
                    size="small"
                    onClick={() => onFormatText(action.action)}
                    disabled={disabled}
                    sx={{ opacity: disabled ? 0.5 : 1 }}
                  >
                    {action.icon}
                  </IconButton>
                </span>
              </Tooltip>
            );
          })}
          <Box sx={{ borderLeft: 1, borderColor: 'divider', mx: 1 }} />
          {aiActions.map((action) => {
            const activeProvider = settings.providers.find(p => p.name === settings.activeProvider);
            const disabled = !getSelectedText() || !activeProvider;
            const tooltipTitle = !getSelectedText()
              ? 'Please select text first'
              : !activeProvider
                ? 'Please configure an AI provider in settings'
                : action.name;
            
            return (
              <Tooltip
                key={action.name}
                title={tooltipTitle}
                disableHoverListener={disabled}
              >
                <span>
                  <IconButton
                    size="small"
                    onClick={(e) =>
                      action.action === 'custom'
                        ? setAiMenuAnchor(e.currentTarget)
                        : handleAIAction(action.action)
                    }
                    disabled={disabled}
                    sx={{ opacity: disabled ? 0.5 : 1 }}
                  >
                    {action.icon}
                  </IconButton>
                </span>
              </Tooltip>
            );
          })}
        </Stack>
      </Paper>
    </Box>
  );
};

export default QuickActionBar;
