import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  TextField,
  Alert,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import { useAIStore } from '../../stores/aiStore';
import { AIProviderSettings } from '../../types/ai';

const DEFAULT_PROVIDER = {
  name: '',
  apiEndpoint: 'https://api.openai.com',
  apiKey: '',
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 2000,
};

interface AISettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AISettingsDialog: React.FC<AISettingsDialogProps> = ({ open, onClose }) => {
  const { settings, addProvider, removeProvider, updateProvider, setActiveProvider } = useAIStore();
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AIProviderSettings | null>(null);
  const [formData, setFormData] = useState<AIProviderSettings>(DEFAULT_PROVIDER);
  const [error, setError] = useState<string>('');

  const handleOpenProviderDialog = (provider?: AIProviderSettings) => {
    if (provider) {
      setFormData(provider);
      setEditingProvider(provider);
    } else {
      setFormData(DEFAULT_PROVIDER);
      setEditingProvider(null);
    }
    setIsProviderDialogOpen(true);
    setError('');
  };

  const handleCloseProviderDialog = () => {
    setIsProviderDialogOpen(false);
    setFormData(DEFAULT_PROVIDER);
    setEditingProvider(null);
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Provider name is required';
    if (!formData.apiEndpoint.trim()) return 'API endpoint is required';
    if (!formData.apiKey.trim()) return 'API key is required';
    if (!formData.modelName?.trim()) return 'Model name is required';
    return '';
  };

  const handleSubmit = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (editingProvider) {
      updateProvider(editingProvider.name, formData);
    } else {
      addProvider(formData);
    }
    handleCloseProviderDialog();
  };

  const handleDelete = (name: string) => {
    removeProvider(name);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          AI Settings
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenProviderDialog()}
          >
            Add Provider
          </Button>
        </Box>

        {settings.providers.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No AI providers configured. Add a provider to start using AI features.
          </Alert>
        ) : (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Active Provider</InputLabel>
            <Select
              value={settings.activeProvider}
              label="Active Provider"
              onChange={(e) => setActiveProvider(e.target.value)}
            >
              {settings.providers.map((provider) => (
                <MenuItem key={provider.name} value={provider.name}>
                  {provider.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {settings.providers.map((provider) => (
          <Card key={provider.name} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="h3">
                  {provider.name}
                </Typography>
                <Box>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenProviderDialog(provider)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(provider.name)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Typography color="textSecondary" gutterBottom>
                Endpoint: {provider.apiEndpoint}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Model: {provider.modelName}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </DialogContent>

      {/* Provider Dialog */}
      <Dialog open={isProviderDialogOpen} onClose={handleCloseProviderDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProvider ? 'Edit Provider' : 'Add Provider'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Provider Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="API Endpoint"
            value={formData.apiEndpoint}
            onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="API Key"
            type="password"
            value={formData.apiKey}
            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Model Name"
            value={formData.modelName}
            onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Temperature"
            type="number"
            inputProps={{ min: 0, max: 1, step: 0.1 }}
            value={formData.temperature}
            onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Max Tokens"
            type="number"
            value={formData.maxTokens}
            onChange={(e) => setFormData({ ...formData, maxTokens: Number(e.target.value) })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProviderDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProvider ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default AISettingsDialog;
