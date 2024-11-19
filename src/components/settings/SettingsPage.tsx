import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useAuthStore } from '../../stores/authStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const SettingsPage = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const { user, updateUser } = useAuthStore();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSettingChange = async (setting: string, value: any) => {
    if (!user) return;

    await updateUser({
      ...user,
      preferences: {
        ...user.preferences,
        [setting]: value
      }
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Typography variant="h5" sx={{ p: 2 }}>
          Settings
        </Typography>
        <Divider />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="General" />
            <Tab label="Editor" />
            <Tab label="Theme" />
            <Tab label="Plugins" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <List>
            <ListItem>
              <FormControlLabel
                control={
                  <Switch
                    checked={user?.preferences?.autoSave || false}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  />
                }
                label="Auto Save"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Switch
                    checked={user?.preferences?.livePreview || false}
                    onChange={(e) => handleSettingChange('livePreview', e.target.checked)}
                  />
                }
                label="Live Preview"
              />
            </ListItem>
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <List>
            <ListItem>
              <FormControl fullWidth>
                <TextField
                  label="Font Size"
                  type="number"
                  value={user?.preferences?.editorSettings?.fontSize || 14}
                  onChange={(e) => handleSettingChange('editorSettings.fontSize', Number(e.target.value))}
                />
              </FormControl>
            </ListItem>
            <ListItem>
              <FormControl fullWidth>
                <TextField
                  label="Tab Size"
                  type="number"
                  value={user?.preferences?.editorSettings?.tabSize || 2}
                  onChange={(e) => handleSettingChange('editorSettings.tabSize', Number(e.target.value))}
                />
              </FormControl>
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Switch
                    checked={user?.preferences?.editorSettings?.showLineNumbers || true}
                    onChange={(e) => handleSettingChange('editorSettings.showLineNumbers', e.target.checked)}
                  />
                }
                label="Show Line Numbers"
              />
            </ListItem>
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <List>
            <ListItem>
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={user?.preferences?.theme || 'dark'}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  label="Theme"
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="body1">
            Plugin management coming soon...
          </Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
};
