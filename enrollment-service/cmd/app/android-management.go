package app

import (
	"context"
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

// func (c AndroidManagementClient) LoadPolicies() ([]*androidmanagement.Policy, error) {
// 	list, err := c.service.Enterprises.Policies.List(enterprise_name).Do()
// 	if err != nil {
// 		fmt.Println("Error loading Policies :", err)
// 		return nil, err
// 	}
// 	return list.Policies, nil
// }

// func (c AndroidManagementClient) AddNewPolicy(policyName string, policy androidmanagement.Policy) (*androidmanagement.Policy, error) {
// 	var policyPath = enterprise_name + "/policies/" + policyName
// 	res, err := c.service.Enterprises.Policies.Patch(policyPath, &policy).Do()
// 	if err != nil {
// 		fmt.Println("Error adding Policies :", err)
// 		return nil, err
// 	}
// 	return res, nil
// }
// func (c AndroidManagementClient) DeletePolicy(policyName string) (*androidmanagement.Empty, error) {
// 	var policyPath = enterprise_name + "/policies/" + policyName
// 	res, err := c.service.Enterprises.Policies.Delete(policyPath).Do()
// 	if err != nil {
// 		fmt.Println("Error adding Policies :", err)
// 		return nil, err
// 	}
// 	return res, nil
// }
// func (c AndroidManagementClient) GetPolicy(policyName string) (*androidmanagement.Policy, error) {
// 	var policyPath = enterprise_name + "/policies/" + policyName
// 	res, err := c.service.Enterprises.Policies.Get(policyPath).Do()
// 	if err != nil {
// 		fmt.Println("Error adding Policies :", err)
// 		return nil, err
// 	}
// 	return res, nil
// }

func (c AndroidManagementClient) CreateEnrollmentToken(PolicyName string, OneTimeOnly bool, AllowPersonalUsageFlag bool) (*androidmanagement.EnrollmentToken, error) {

	var AllowPersonalUsage string
	if AllowPersonalUsageFlag {
		AllowPersonalUsage = "PERSONAL_USAGE_ALLOWED"
	} else {
		AllowPersonalUsage = "PERSONAL_USAGE_DISALLOWED"
	}

	EnrollmentToken, err := c.service.Enterprises.EnrollmentTokens.Create(enterprise_name, &androidmanagement.EnrollmentToken{PolicyName: PolicyName, OneTimeOnly: OneTimeOnly, AllowPersonalUsage: AllowPersonalUsage}).Do()
	if err != nil {
		return nil, err
	}

	return EnrollmentToken, nil
}

func (c AndroidManagementClient) LoadAllEnrollmentTokens() (*androidmanagement.ListEnrollmentTokensResponse, error) {
	li, err := c.service.Enterprises.EnrollmentTokens.List(enterprise_name).Do()
	if err != nil {
		return nil, err
	}
	return li, nil
}
func (c AndroidManagementClient) GetEnrollmentToken(EnrollmentTokensName string) (*androidmanagement.EnrollmentToken, error) {
	res, err := c.service.Enterprises.EnrollmentTokens.Get(EnrollmentTokensName).Do()
	if err != nil {
		return nil, err
	}
	return res, nil
}
func (c AndroidManagementClient) DeleteEnrollmentToken(EnrollmentTokensName string) (*androidmanagement.Empty, error) {
	res, err := c.service.Enterprises.EnrollmentTokens.Delete(EnrollmentTokensName).Do()
	if err != nil {
		return nil, err
	}
	return res, nil
}
