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
func (c AndroidManagementClient) LoadPolicies() ([]*androidmanagement.Policy, error) {
	list, err := c.service.Enterprises.Policies.List(enterprise_name).Do()
	if err != nil {
		fmt.Println("Error loading Policies :", err)
		return nil, err
	}
	return list.Policies, nil
}

func (c AndroidManagementClient) AddNewPolicy(policyName string, policy androidmanagement.Policy) (*androidmanagement.Policy, error) {
	var policyPath = enterprise_name + "/policies/" + policyName
	res, err := c.service.Enterprises.Policies.Patch(policyPath, &policy).Do()
	if err != nil {
		fmt.Println("Error adding Policies :", err)
		return nil, err
	}
	return res, nil
}
func (c AndroidManagementClient) DeletePolicy(policyName string) (*androidmanagement.Empty, error) {
	var policyPath = enterprise_name + "/policies/" + policyName
	res, err := c.service.Enterprises.Policies.Delete(policyPath).Do()
	if err != nil {
		fmt.Println("Error adding Policies :", err)
		return nil, err
	}
	return res, nil
}
func (c AndroidManagementClient) GetPolicy(policyName string) (*androidmanagement.Policy, error) {
	var policyPath = enterprise_name + "/policies/" + policyName
	res, err := c.service.Enterprises.Policies.Get(policyPath).Do()
	if err != nil {
		fmt.Println("Error adding Policies :", err)
		return nil, err
	}
	return res, nil
}

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

// ctx := context.Background()
// data, err := file_helpers.ReadFile(tokenPath)
// if err != nil {
// 	log.Fatal(err)
// }

// androidmanagementService, err := androidmanagement.NewService(ctx, option.WithCredentialsJSON(data))
// if err != nil {
// 	log.Fatal(err)
// }

// // res, err := androidmanagementService.SignupUrls.Create().ProjectId(projectId)
// // .Do()

// // if err != nil {
// // 	fmt.Println("Not authenticated:", err)
// // }
// // fmt.Println(res)
// // fmt.Println("")
// // rawUrl := res.Url
// // parsedUrl, err := url.Parse(rawUrl)
// // if err != nil {
// // 	fmt.Println("Error parsing URL:", err)
// // 	return
// // }

// // token := parsedUrl.Query().Get("token")
// // fmt.Println("Token:", token)
// // SignupUrl signupUrl =
// // androidManagementClient
// // 	.signupUrls()
// // 	.create()
// // 	.setProjectId("myProject")
// // 	.setCallbackUrl("https://example.com/myEmmConsole")
// // 	.execute();

// response, err := androidmanagementService.Enterprises.List().ProjectId(projectId).Do()
// if err != nil {
// 	fmt.Println("Not authenticated:", err)
// }

// fmt.Println(response.Enterprises)
// for _, item := range response.Enterprises {
// 	fmt.Println(item)
// }
// // create enterprise
// // enterprise := &androidmanagement.Enterprise{}
// // response, err := androidmanagementService.Enterprises.Create(enterprise).ProjectId(projectId).EnterpriseToken(enterpriseToken).SignupUrlName(res.Name).Do()
// // if err != nil {
// // 	fmt.Println("error creating Enterprises", err.Error())
// // }
// // fmt.Println(response)

// // androidmanagementService.pol
// policy := &androidmanagement.Policy{
// 	Applications: []*androidmanagement.ApplicationPolicy{
// 		{
// 			PackageName: "com.google.samples.apps.iosched",
// 			InstallType: "FORCE_INSTALLED",
// 		},
// 	},
// 	AdvancedSecurityOverrides: &androidmanagement.AdvancedSecurityOverrides{DeveloperSettings: "DEVELOPER_SETTINGS_DISABLED"},
// }
// res, err := androidmanagementService.Enterprises.Policies.Patch(enterprise_name+"/policies/policy1", policy).Do()
// if err != nil {
// 	fmt.Println("Error adding Policies :", err)
// }
// fmt.Println(res)

// list, err := androidmanagementService.Enterprises.Policies.List(enterprise_name).Do()
// if err != nil {
// 	fmt.Println("Error adding Policies :", err)
// }
// fmt.Println(list.Policies)

// for _, item := range list.Policies {
// 	fmt.Println(item.Name)
// }

// EnrollmentToken, err := androidmanagementService.Enterprises.EnrollmentTokens.Create(enterprise_name, &androidmanagement.EnrollmentToken{PolicyName: "enterprises/LC03wlssib/policies/policy1"}).Do()
// if err != nil {
// 	fmt.Println("Error adding Policies :", err)
// }

// fmt.Println(EnrollmentToken.Value)

// enrollment_link := "https://enterprise.google.com/android/enroll?et=" + EnrollmentToken.Value

// fmt.Println(enrollment_link)

// li, err := androidmanagementService.Enterprises.EnrollmentTokens.List(enterprise_name).Do()
// if err != nil {
// 	fmt.Println("Error adding Policies :", err)
// }
// for _, item := range li.EnrollmentTokens {
// 	fmt.Println(item.Name, item.PolicyName)
// 	// fmt.Println(item.Name)
// }
