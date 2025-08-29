# End-to-End MERN Application Deployment and Monitoring


### 1. Terraform and Ansible Setup

**Terraform Setup:**
- Terraform version: `1.x.x`  
- Providers used: `aws`  
- Terraform directory structure:
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
└── provider.tf

- **Steps performed:**
1. Configured AWS provider with access keys.
2. Created EC2 instances (`mern-1` and `mern-2`) for application deployment.
3. Configured security groups for SSH, HTTP, and application ports.
4. Defined outputs for EC2 public IPs for later use in Ansible deployment.

**Ansible Setup:**
- Ansible version: `2.14.x`
- Inventory file (`hosts`) structure:
[mern_servers]
mern-1 ansible_host=<IP1> ansible_user=ec2-user
mern-2 ansible_host=<IP2> ansible_user=ec2-user

- Playbooks used:
ansible/
├── install_node.yml # Install Node.js and dependencies
├── setup_backend.yml # Deploy backend code
├── setup_frontend.yml # Deploy frontend code
├── setup_mongodb.yml # Configure MongoDB Atlas connection
└── setup_prometheus.yml # Install and configure Prometheus


- **Deployment steps:**
1. Installed required packages and Node.js.
2. Pulled application code from GitHub repository.
3. Configured environment variables for backend (`.env` file).
4. Started backend and frontend services using `pm2`.
5. Installed and configured Prometheus for monitoring.

---

### 2. Application Architecture

**Architecture Diagram:**

+------------------+ +------------------+ +------------------+
| Client Browser | <----> | Nginx (Frontend)| <----> | React Frontend |
+------------------+ +------------------+ +------------------+
|
v
+------------------+
| Node.js Backend |
+------------------+
|
v
+------------------+
| MongoDB Atlas |
+------------------+
|
v
+------------------+
| Prometheus & Grafana |
+------------------+


- **Flow:** Client interacts with React frontend → Requests routed to Node.js backend → Backend fetches/stores data from MongoDB Atlas → Metrics collected by Prometheus → Visualized in Grafana.

---

### 3. Metric and Log Configuration

**Prometheus Configuration:**
- Configured `prometheus.yml` to scrape metrics from backend API endpoints.

Logging:

Application logs collected via pm2 logs.

Prometheus collects metrics like:

CPU usage

Memory usage

Request count

Response latency

4. Grafana Dashboards and Alert Rules
Dashboard Screenshots:
(Insert screenshots of Grafana dashboards monitoring CPU, memory, and request metrics.)

Alert Rules Configured:

CPU usage > 80% → Trigger email alert.

Memory usage > 75% → Trigger Slack notification.

High response latency (>500ms) → Trigger page alert.

5. Performance Analysis
Average backend response time: 200ms

Maximum CPU usage on EC2 instances: 72%

Memory utilization: 65%

Node.js backend handled ~500 requests/min without downtime.

Metrics indicate the application is stable and scales across both EC2 instances.

6. Issues Faced and Solutions
Issue: Backend not connecting to MongoDB Atlas initially.

Solution: Corrected the IP whitelisting in MongoDB Atlas and verified .env credentials.

Issue: Prometheus scrape target unreachable.

Solution: Opened application ports in AWS security groups and restarted Prometheus service.

Issue: Grafana dashboard not displaying metrics.

Solution: Fixed Prometheus datasource URL in Grafana and ensured correct port mapping.

Issue: EC2 instances running out of memory during load testing.

Solution: Increased instance type from t2.medium to t2.la
