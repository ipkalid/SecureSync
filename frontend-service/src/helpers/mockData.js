const MockEnvironmentEnabled = true;
const DeviceManagementData = [
  {
    apiLevel: 34,
    appliedPolicyName: "enterprises/LC03wlssib/policies/policy1",
    appliedPolicyVersion: "1",
    appliedState: "ACTIVE",
    enrollmentTime: "2024-03-24T03:12:40.546Z",
    enrollmentTokenName:
      "enterprises/LC03wlssib/enrollmentTokens/QzogB1m4FQC5o-R51ZG6lj2g3z1Fgs6ymqdKDvIL95A",
    hardwareInfo: {
      brand: "OnePlus",
      deviceBasebandVersion: "Q_V1_P14,Q_V1_P14",
      enterpriseSpecificId: "BHYM-BGP7-JRBB-3CFZ7-6H42-RX3W-H",
      hardware: "qcom",
      manufacturer: "OnePlus",
      model: "CPH2449",
      serialNumber: "BHYM-BGP7-JRBB-3CFZ7-6H42-RX3W-H",
    },
    lastPolicySyncTime: "2024-04-24T10:11:35.454Z",
    lastStatusReportTime: "2024-04-23T18:01:32.618Z",
    managementMode: "PROFILE_OWNER",
    memoryInfo: {
      totalInternalStorage: "720957440",
      totalRam: "15919218688",
    },
    name: "enterprises/LC03wlssib/devices/31030bbe0516e366",
    nonComplianceDetails: [
      {
        installationFailureReason: "INSTALLATION_FAILURE_REASON_UNKNOWN",
        nonComplianceReason: "APP_NOT_INSTALLED",
        packageName: "com.google.samples.apps.iosched",
        settingName: "applications",
      },
      {
        fieldPath: "advancedSecurityOverrides.developerSettings",
        nonComplianceReason: "MANAGEMENT_MODE",
        settingName: "advancedSecurityOverrides",
      },
    ],
    ownership: "PERSONALLY_OWNED",
    policyCompliant: true,
    policyName: "enterprises/LC03wlssib/policies/policy1",
    securityPosture: {
      devicePosture: "SECURE",
    },
    state: "ACTIVE",
    userName: "enterprises/LC03wlssib/users/112818122639928760428",
  },
  {
    apiLevel: 34,
    appliedPolicyName: "enterprises/LC03wlssib/policies/newPolicy6",
    appliedPolicyVersion: "1",
    appliedState: "ACTIVE",
    enrollmentTime: "2024-04-19T18:21:19.773Z",
    enrollmentTokenName:
      "enterprises/LC03wlssib/enrollmentTokens/VSBBUApFC1Cxn3pWzJt_fNN-wNLMVqfbfGodmwZTsh0",
    hardwareInfo: {
      brand: "Nothing",
      deviceBasebandVersion:
        "MPSS.HI.4.3.3-00781-LC_ALL_PACK-1.626320.2.635053.2",
      enterpriseSpecificId: "GVSG-TYR6-ESAW-HN55E-WDA7-6PQR-I",
      hardware: "qcom",
      manufacturer: "Nothing",
      model: "A063",
      serialNumber: "GVSG-TYR6-ESAW-HN55E-WDA7-6PQR-I",
    },
    lastPolicySyncTime: "2024-04-19T18:22:25.364Z",
    lastStatusReportTime: "2024-04-19T18:22:34.244Z",
    managementMode: "PROFILE_OWNER",
    memoryInfo: {
      totalInternalStorage: "1180577792",
      totalRam: "7610990592",
    },
    name: "enterprises/LC03wlssib/devices/37b13a211dba4162",
    nonComplianceDetails: [
      {
        installationFailureReason: "IN_PROGRESS",
        nonComplianceReason: "APP_NOT_INSTALLED",
        packageName: "com.google.samples.apps.iosched",
        settingName: "applications",
      },
    ],
    ownership: "PERSONALLY_OWNED",
    policyCompliant: true,
    policyName: "enterprises/LC03wlssib/policies/newPolicy6",
    powerManagementEvents: [
      {
        createTime: "2024-04-19T18:19:15.083Z",
        eventType: "BOOT_COMPLETED",
      },
    ],
    securityPosture: {
      devicePosture: "SECURE",
    },
    state: "ACTIVE",
    userName: "enterprises/LC03wlssib/users/105756085330478222616",
  },
  {
    apiLevel: 34,
    appliedPolicyName: "enterprises/LC03wlssib/policies/newPolicy6",
    appliedPolicyVersion: "1",
    appliedState: "ACTIVE",
    enrollmentTime: "2024-04-28T19:47:14.780Z",
    enrollmentTokenName:
      "enterprises/LC03wlssib/enrollmentTokens/0W-Vs5ibkYyvjh7bIepxgFPyIJrjchOUgQpd2YSyNhQ",
    hardwareInfo: {
      brand: "samsung",
      deviceBasebandVersion: "F946BXXU1BWKF,F946BXXU1BWKF",
      enterpriseSpecificId: "NFQ7-FCUV-DTMC-ZMYJD-2BDG-5UE6-B",
      hardware: "qcom",
      manufacturer: "samsung",
      model: "SM-F946B",
      serialNumber: "NFQ7-FCUV-DTMC-ZMYJD-2BDG-5UE6-B",
    },
    lastPolicySyncTime: "2024-04-28T19:47:17.040Z",
    lastStatusReportTime: "2024-04-28T19:47:24.961Z",
    managementMode: "PROFILE_OWNER",
    memoryInfo: {
      totalInternalStorage: "5531848704",
      totalRam: "11670523904",
    },
    name: "enterprises/LC03wlssib/devices/3e7ffb6866dac4b0",
    nonComplianceDetails: [
      {
        installationFailureReason: "IN_PROGRESS",
        nonComplianceReason: "APP_NOT_INSTALLED",
        packageName: "com.google.samples.apps.iosched",
        settingName: "applications",
      },
    ],
    ownership: "PERSONALLY_OWNED",
    policyCompliant: true,
    policyName: "enterprises/LC03wlssib/policies/newPolicy6",
    powerManagementEvents: [
      {
        createTime: "2024-04-28T19:46:52.695Z",
        eventType: "BOOT_COMPLETED",
      },
    ],
    securityPosture: {
      devicePosture: "SECURE",
    },
    state: "ACTIVE",
    userName: "enterprises/LC03wlssib/users/102792903350490018105",
  },
];

const PolicyManagementData = [
  {
    applications: [
      {
        installType: "FORCE_INSTALLED",
        packageName: "com.google.samples.apps.iosched",
      },
    ],
    name: "enterprises/LC03wlssib/policies/newPolicy6",
    version: "1",
  },
  {
    applications: [
      {
        installType: "FORCE_INSTALLED",
        packageName: "com.google.samples.apps.iosched",
      },
    ],
    name: "enterprises/LC03wlssib/policies/newPolicy8",
    version: "1",
  },
  {
    applications: [
      {
        installType: "FORCE_INSTALLED",
        packageName: "com.google.samples.apps.iosched",
      },
    ],
    name: "enterprises/LC03wlssib/policies/newPolicy9",
    version: "1",
  },
  {
    advancedSecurityOverrides: {
      developerSettings: "DEVELOPER_SETTINGS_DISABLED",
    },
    applications: [
      {
        installType: "FORCE_INSTALLED",
        packageName: "com.google.samples.apps.iosched",
      },
    ],
    name: "enterprises/LC03wlssib/policies/policy1",
    version: "1",
  },
  {
    applications: [
      {
        installType: "FORCE_INSTALLED",
        packageName: "com.whatsapp",
      },
      {
        installType: "FORCE_INSTALLED",
        packageName: "com.google.android.youtube",
      },
    ],
    blockApplicationsEnabled: true,
    name: "enterprises/LC03wlssib/policies/testingyoutube",
    playStoreMode: "WHITELIST",
    screenCaptureDisabled: true,
    version: "1",
  },
];

export { DeviceManagementData,PolicyManagementData, MockEnvironmentEnabled };
