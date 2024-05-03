package app

import (
	"context"
	"fmt"
	"log"

	"github.com/ipkalid/go-common/file_helpers"
	"google.golang.org/api/androidmanagement/v1"
	"google.golang.org/api/option"
)

const (
	tokenPath       = "tokens/kfupm-mdm-9c4d6a476340.json"
	projectId       = "kfupm-mdm"
	enterprise_name = "enterprises/LC03wlssib"
)

type AndroidManagementClient struct {
	service *androidmanagement.Service
}

func NewAndroidManagementClient() (*AndroidManagementClient, error) {
	androidmanagement, err := connectToAndroidmanagement()
	if err != nil {
		return nil, err
	}
	return &AndroidManagementClient{service: androidmanagement}, nil
}

func connectToAndroidmanagement() (*androidmanagement.Service, error) {
	data, err := file_helpers.ReadFile(tokenPath)
	if err != nil {
		log.Fatal(err)
	}

	androidmanagementService, err := androidmanagement.NewService(context.Background(), option.WithCredentialsJSON(data))
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	return androidmanagementService, nil
}

func (c *AndroidManagementClient) LoadAllDevices() ([]*androidmanagement.Device, error) {
	// Create a new list devices request
	listDevicesRequest := c.service.Enterprises.Devices.List(enterprise_name)

	// Execute the list devices request
	listDevicesResponse, err := listDevicesRequest.Do()
	if err != nil {
		return nil, err
	}

	// Return the list of devices
	return listDevicesResponse.Devices, nil
}

func (c *AndroidManagementClient) GetDevice(deviceId string) (*androidmanagement.Device, error) {
	var devicePath = enterprise_name + "/devices/" + deviceId
	device, err := c.service.Enterprises.Devices.Get(devicePath).Do()

	if err != nil {
		fmt.Println("Error deleting a device  :", err)
		return nil, err
	}
	return device, nil
}

func (c *AndroidManagementClient) DeleteDevice(deviceId string) error {
	var devicePath = enterprise_name + "/devices/" + deviceId
	_, err := c.service.Enterprises.Devices.Delete(devicePath).Do()
	if err != nil {
		fmt.Println("Error deleting a device  :", err)
		return err
	}
	return nil
}

func (c *AndroidManagementClient) UpdateDevicePolicy(deviceId string, policyName string) error {
	var devicePath = enterprise_name + "/devices/" + deviceId

	// Get the current device
	device, err := c.service.Enterprises.Devices.Get(devicePath).Do()
	if err != nil {
		fmt.Println("Error getting the device:", err)
		return err
	}

	var policyPath = enterprise_name + "/policies/" + policyName

	// Update the policy
	device.PolicyName = policyPath

	// Patch the device with the updated policy
	_, err = c.service.Enterprises.Devices.Patch(devicePath, device).Do()
	if err != nil {
		fmt.Println("Error updating the device policy:", err)
		return err
	}

	return nil
}
