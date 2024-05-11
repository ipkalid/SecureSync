# SecureSync
SecureSync is a comprehensive microservice-based platform designed to manage mobile device management (MDM) securely and efficiently. The system integrates multiple services including authentication, device management, enrollment processes, policy management, and mail services, all powered by a robust tech stack including Golang, Docker, Kubernetes, React Native, Postgres, and MongoDB.

## Services
The SecureSync platform consists of the following services:

- AuthService: Handles all authentication and authorization processes.
- DeviceService: Manages storage of device information within the MDM system.
- EnrollmentService: Responsible for enrolling new devices into the MDM system.
- MailService: Facilitates sending emails to users.
- FrontendService: Provides the user interface developed using React Native.
- PolicyService: Manages the creation and administration of policies for the MDM system.
## Tech Stack
- Golang: Used for backend services.
- Docker: Containers for deploying and managing applications.
- Kubernetes: Orchestration of the containerized applications.
- React: Development of the frontend service.
- Postgres: Database for relational data management.
- MongoDB: Database for document-oriented data storage.
## Setup Process
To get started with SecureSync, you will need to prepare your environment by downloading and installing the necessary tools and securing the required keys.

Prerequisites
1. Golang: Download and install Golang from Golang Official Website.
2. Node.js: Download and install Node.js from Node.js Official Website.
3. Docker: Download and install Docker from Docker Hub.
4. Google Cloud MDM Keys: Obtain necessary MDM keys from Google Cloud for device management services.
5. Get email key from gmeil and add it into mail service
## Installation Steps
Clone the Repository

```bash
git clone https://github.com/ipkalid/SecureSync.git
cd securesync
```
to build locally
Use Docker to build each service.
```bash
cd project
docker-compose up --build
```

to build in any cloud
Use Kubernetes to build each service.
```bash
cd project
kubectl apply -f
```

## Contributing
Contributions to SecureSync are welcomed! Please read the CONTRIBUTING.md file for guidelines on how to submit issues, feature requests, and code.

## License
SecureSync is released under the MIT License. See the LICENSE file for more details.





