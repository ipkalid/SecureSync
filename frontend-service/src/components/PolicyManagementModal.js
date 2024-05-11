import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  TextField
} from '@mui/material';

const deviceSettingsOptions = [
  'screenCaptureDisabled',
  'cameraDisabled',
  'keyguardDisabledFeatures',
  'defaultPermissionPolicy',
  'addUserDisabled',
  'adjustVolumeDisabled',
  'factoryResetDisabled',
  'installAppsDisabled',
  'mountPhysicalMediaDisabled',
  'modifyAccountsDisabled',
  'safeBootDisabled',
  'uninstallAppsDisabled',
  'statusBarDisabled',
  'keyguardDisabled',
  'vpnConfigDisabled',
  'wifiConfigDisabled',
  'usbFileTransferDisabled',
  'smsDisabled',
  'dataRoamingDisabled',
  'locationMode'
];

const appsOptions = [
  'YouTube',
  'Slack',
  'Microsoft Teams',
  'Zoom',
  'Google Drive',
  'Salesforce',
  'Trello',
  'Asana',
  'Adobe Acrobat Reader',
  'Microsoft Outlook',
  'Dropbox',
  'Evernote',
  'LinkedIn',
  'QuickBooks',
  'Shopify',
  'Google Analytics',
  'Microsoft OneDrive',
  'Tableau Mobile',
  'Jira',
  'HubSpot'
];

// Mapping apps to package names (hypothetical)
const appPackageMap = {
  'YouTube': 'com.google.android.youtube',
  'Slack': 'com.slack',
  'Microsoft Teams': 'com.microsoft.teams',
  'Zoom': 'us.zoom.videomeetings',
  'Google Drive': 'com.google.android.apps.docs',
  'Salesforce': 'com.salesforce.chatter',
  'Trello': 'com.trello',
  'Asana': 'com.asana.app',
  'Adobe Acrobat Reader': 'com.adobe.reader',
  'Microsoft Outlook': 'com.microsoft.office.outlook',
  'Dropbox': 'com.dropbox.android',
  'Evernote': 'com.evernote',
  'LinkedIn': 'com.linkedin.android',
  'QuickBooks': 'com.intuit.quickbooks',
  'Shopify': 'com.shopify.mobile',
  'Google Analytics': 'com.google.android.apps.giant',
  'Microsoft OneDrive': 'com.microsoft.skydrive',
  'Tableau Mobile': 'com.tableausoftware.app',
  'Jira': 'com.atlassian.android.jira.core',
  'HubSpot': 'com.hubspot.android'
};

function PolicyModal() {
  const [open, setOpen] = useState(false);
  const [deviceSettings, setDeviceSettings] = useState({});
  const [installedApps, setInstalledApps] = useState({});
  const [policyName, setPolicyName] = useState('');
  const [savedPolicy, setSavedPolicy] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggleDeviceSetting = (option) => {
    setDeviceSettings(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleAddPolicy = async (policy) => {
  
    try {
      const response = await fetch("api3/mdm/policy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": '',
        },
        body: JSON.stringify({
           ...policy,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.message || "Failed to enroll device");
      }
      window.location.reload();
    } catch (error) {
      console.log(error)
    }
  };

  const handleToggleApp = (app) => {
    setInstalledApps(prev => ({
      ...prev,
      [app]: !prev[app]
    }));
  };

  const handleSave = async() => {
    const applications = Object.keys(installedApps).filter(app => installedApps[app]).map(app => ({
      packageName: appPackageMap[app],
      installType: 'FORCE_INSTALLED'
    }));
    const policy = {
      name: policyName,
      policy: {
        applications,
        ...deviceSettings
      }
    };
    console.log(policy);
    setSavedPolicy(policy);
    await handleAddPolicy(policy)
  };

  return (
    <Box>
      <Button variant="outlined" onClick={handleClickOpen}>
        Configure Policy
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Configure Policy Options</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Policy Name"
            value={policyName}
            onChange={(e) => setPolicyName(e.target.value)}
            margin="normal"
          />
          <Typography variant="h6" gutterBottom>
            Device Settings
          </Typography>
          <FormGroup>
            {deviceSettingsOptions.map(option => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!deviceSettings[option]}
                    onChange={() => handleToggleDeviceSetting(option)}
                    name={option}
                  />
                }
                label={option}
                key={option}
              />
            ))}
          </FormGroup>
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Apps that can be installed
          </Typography>
          <FormGroup>
            {appsOptions.map(app => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!installedApps[app]}
                    onChange={() => handleToggleApp(app)}
                    name={app}
                  />
                }
                label={app}
                key={app}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PolicyModal;
