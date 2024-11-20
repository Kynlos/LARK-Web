import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAIStore } from '../../stores/aiStore';
import { AIProviderSettings } from '../../types/ai';

const DEFAULT_PROVIDER = {
    name: '',
    apiEndpoint: 'https://api.groq.com',
    apiKey: '',
    modelName: 'llama3-8b-8192',
    temperature: 0.7,
    maxTokens: 2000,
};

export const AISettings: React.FC = () => {
    const { settings, addProvider, removeProvider, updateProvider, setActiveProvider } = useAIStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProvider, setEditingProvider] = useState<AIProviderSettings | null>(null);
    const [formData, setFormData] = useState<AIProviderSettings>(DEFAULT_PROVIDER);
    const [error, setError] = useState<string>('');

    const handleOpenDialog = (provider?: AIProviderSettings) => {
        if (provider) {
            setFormData(provider);
            setEditingProvider(provider);
        } else {
            setFormData(DEFAULT_PROVIDER);
            setEditingProvider(null);
        }
        setIsDialogOpen(true);
        setError('');
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
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
        handleCloseDialog();
    };

    const handleDelete = (name: string) => {
        removeProvider(name);
    };

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">
                    AI Settings
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
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
                                    <IconButton onClick={() => handleOpenDialog(provider)}>
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

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
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
                        placeholder="https://api.groq.com"
                    />
                    <TextField
                        fullWidth
                        label="API Key"
                        value={formData.apiKey}
                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                        margin="normal"
                        type="password"
                    />
                    <TextField
                        fullWidth
                        label="Model Name"
                        value={formData.modelName}
                        onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                        margin="normal"
                        placeholder="llama3-8b-8192"
                    />
                    <TextField
                        fullWidth
                        label="Temperature"
                        value={formData.temperature}
                        onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                        margin="normal"
                        type="number"
                        inputProps={{ min: 0, max: 1, step: 0.1 }}
                    />
                    <TextField
                        fullWidth
                        label="Max Tokens"
                        value={formData.maxTokens}
                        onChange={(e) => setFormData({ ...formData, maxTokens: Number(e.target.value) })}
                        margin="normal"
                        type="number"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingProvider ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
