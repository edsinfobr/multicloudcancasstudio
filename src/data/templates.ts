import { DiagramState } from '../types';

export const STARTER_TEMPLATES: DiagramState[] = [
  // ==========================================
  // AWS TEMPLATES
  // ==========================================
  {
    id: 'template_aws_3tier',
    title: 'AWS High Availability 3-Tier Web App (IaaS)',
    description: 'Production-ready 3-tier AWS IaaS architecture with Public Subnet ALB, EC2 Auto Scaling Group in Private Subnets, and Multi-AZ RDS PostgreSQL with S3 & CloudFront.',
    primaryProvider: 'aws',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    containers: [
      {
        id: 'c_vpc',
        name: 'AWS VPC (10.0.0.0/16)',
        provider: 'aws',
        type: 'vpc',
        x: 60,
        y: 60,
        width: 880,
        height: 520,
        color: '#FF9900'
      },
      {
        id: 'c_pub_subnet',
        name: 'Public Subnet (10.0.1.0/24) - us-east-1a',
        provider: 'aws',
        type: 'subnet',
        x: 100,
        y: 120,
        width: 800,
        height: 120,
        color: '#3B82F6',
        isPublicSubnet: true
      },
      {
        id: 'c_priv_subnet',
        name: 'Private Subnet (10.0.2.0/24) - us-east-1b',
        provider: 'aws',
        type: 'subnet',
        x: 100,
        y: 270,
        width: 800,
        height: 270,
        color: '#10B981',
        isPublicSubnet: false
      }
    ],
    nodes: [
      {
        id: 'n_user',
        name: 'Internet Users',
        provider: 'generic',
        category: 'networking',
        iconKey: 'generic_user',
        resourceType: 'generic_user',
        x: 460,
        y: 0,
        specs: { count: 10000 }
      },
      {
        id: 'n_cloudfront',
        name: 'CloudFront CDN',
        provider: 'aws',
        category: 'networking',
        iconKey: 'aws_cloudfront',
        resourceType: 'aws_cloudfront_distribution',
        x: 300,
        y: 150,
        containerId: 'c_pub_subnet',
        specs: { transferGb: 1000 }
      },
      {
        id: 'n_alb',
        name: 'App Load Balancer (ALB)',
        provider: 'aws',
        category: 'networking',
        iconKey: 'aws_alb',
        resourceType: 'aws_lb',
        x: 540,
        y: 150,
        containerId: 'c_pub_subnet',
        specs: { count: 1, isPublic: true }
      },
      {
        id: 'n_ec2_1',
        name: 'App Server (EC2 #1)',
        provider: 'aws',
        category: 'compute',
        iconKey: 'aws_ec2',
        resourceType: 'aws_instance',
        x: 200,
        y: 320,
        containerId: 'c_priv_subnet',
        specs: { instanceType: 't3.medium', count: 1, storageGb: 30, region: 'us-east-1' }
      },
      {
        id: 'n_ec2_2',
        name: 'App Server (EC2 #2)',
        provider: 'aws',
        category: 'compute',
        iconKey: 'aws_ec2',
        resourceType: 'aws_instance',
        x: 420,
        y: 320,
        containerId: 'c_priv_subnet',
        specs: { instanceType: 't3.medium', count: 1, storageGb: 30, region: 'us-east-1' }
      },
      {
        id: 'n_rds',
        name: 'Primary RDS PostgreSQL',
        provider: 'aws',
        category: 'database',
        iconKey: 'aws_rds',
        resourceType: 'aws_db_instance',
        x: 660,
        y: 320,
        containerId: 'c_priv_subnet',
        specs: { instanceType: 'db.r6g.xlarge', count: 2, storageGb: 200, engine: 'postgres' }
      },
      {
        id: 'n_s3',
        name: 'Static Assets (S3)',
        provider: 'aws',
        category: 'storage',
        iconKey: 'aws_s3',
        resourceType: 'aws_s3_bucket',
        x: 140,
        y: 150,
        containerId: 'c_pub_subnet',
        specs: { storageGb: 500 }
      }
    ],
    links: [
      { id: 'l1', from: 'n_user', to: 'n_cloudfront', label: 'HTTPS / 443', style: 'solid', protocol: 'HTTPS' },
      { id: 'l2', from: 'n_cloudfront', to: 'n_s3', label: 'S3 Origin Fetch', style: 'dashed', protocol: 'HTTPS' },
      { id: 'l3', from: 'n_cloudfront', to: 'n_alb', label: 'Origin Traffic', style: 'solid', protocol: 'HTTPS' },
      { id: 'l4', from: 'n_alb', to: 'n_ec2_1', label: 'Target Group HTTP:80', style: 'solid', protocol: 'HTTP' },
      { id: 'l5', from: 'n_alb', to: 'n_ec2_2', label: 'Target Group HTTP:80', style: 'solid', protocol: 'HTTP' },
      { id: 'l6', from: 'n_ec2_1', to: 'n_rds', label: 'PostgreSQL 5432', style: 'solid', protocol: 'SQL' },
      { id: 'l7', from: 'n_ec2_2', to: 'n_rds', label: 'PostgreSQL 5432', style: 'solid', protocol: 'SQL' }
    ]
  },
  {
    id: 'template_aws_serverless',
    title: 'AWS Serverless & Event-Driven Microservices (PaaS)',
    description: 'Fully serverless & event-driven architecture using AWS Route 53, CloudFront, API Gateway, Lambda, DynamoDB, EventBridge, SQS, SNS, and Cognito.',
    primaryProvider: 'aws',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    containers: [
      {
        id: 'c_aws_sls_vpc',
        name: 'AWS Cloud Region (us-east-1)',
        provider: 'aws',
        type: 'vpc',
        x: 60,
        y: 60,
        width: 860,
        height: 480,
        color: '#FF9900'
      }
    ],
    nodes: [
      {
        id: 'n_sls_user',
        name: 'Clients & Frontend',
        provider: 'generic',
        category: 'networking',
        iconKey: 'generic_user',
        resourceType: 'generic_user',
        x: 100,
        y: 120,
        containerId: 'c_aws_sls_vpc',
        specs: { count: 10000 }
      },
      {
        id: 'n_cognito',
        name: 'AWS Cognito Auth',
        provider: 'aws',
        category: 'security',
        iconKey: 'aws_cognito',
        resourceType: 'aws_cognito_user_pool',
        x: 100,
        y: 320,
        containerId: 'c_aws_sls_vpc',
        specs: { count: 1 }
      },
      {
        id: 'n_apigw',
        name: 'API Gateway',
        provider: 'aws',
        category: 'networking',
        iconKey: 'aws_api_gateway',
        resourceType: 'aws_api_gateway_rest_api',
        x: 280,
        y: 120,
        containerId: 'c_aws_sls_vpc',
        specs: { count: 1 }
      },
      {
        id: 'n_lambda_order',
        name: 'Order Service Lambda',
        provider: 'aws',
        category: 'compute',
        iconKey: 'aws_lambda',
        resourceType: 'aws_lambda_function',
        x: 460,
        y: 120,
        containerId: 'c_aws_sls_vpc',
        specs: { count: 1, hoursPerMonth: 730 }
      },
      {
        id: 'n_dynamodb',
        name: 'Orders DynamoDB Table',
        provider: 'aws',
        category: 'database',
        iconKey: 'aws_dynamodb',
        resourceType: 'aws_dynamodb_table',
        x: 680,
        y: 120,
        containerId: 'c_aws_sls_vpc',
        specs: { storageGb: 100 }
      },
      {
        id: 'n_eventbridge',
        name: 'EventBridge Bus',
        provider: 'aws',
        category: 'integration',
        iconKey: 'aws_eventbridge',
        resourceType: 'aws_cloudwatch_event_bus',
        x: 460,
        y: 320,
        containerId: 'c_aws_sls_vpc',
        specs: { count: 1 }
      },
      {
        id: 'n_sqs',
        name: 'Processing SQS Queue',
        provider: 'aws',
        category: 'integration',
        iconKey: 'aws_sqs',
        resourceType: 'aws_sqs_queue',
        x: 680,
        y: 280,
        containerId: 'c_aws_sls_vpc',
        specs: { count: 1 }
      },
      {
        id: 'n_sns',
        name: 'Notification SNS Topic',
        provider: 'aws',
        category: 'integration',
        iconKey: 'aws_sns',
        resourceType: 'aws_sns_topic',
        x: 680,
        y: 380,
        containerId: 'c_aws_sls_vpc',
        specs: { count: 1 }
      }
    ],
    links: [
      { id: 'sl1', from: 'n_sls_user', to: 'n_apigw', label: 'HTTPS / JSON', style: 'solid', protocol: 'HTTPS' },
      { id: 'sl2', from: 'n_sls_user', to: 'n_cognito', label: 'OAuth2 / JWT Token', style: 'dashed', protocol: 'HTTPS' },
      { id: 'sl3', from: 'n_apigw', to: 'n_lambda_order', label: 'REST Proxy', style: 'solid', protocol: 'HTTPS' },
      { id: 'sl4', from: 'n_lambda_order', to: 'n_dynamodb', label: 'DynamoDB API', style: 'solid', protocol: 'DynamoDB' },
      { id: 'sl5', from: 'n_lambda_order', to: 'n_eventbridge', label: 'Publish OrderCreated', style: 'solid', protocol: 'HTTPS' },
      { id: 'sl6', from: 'n_eventbridge', to: 'n_sqs', label: 'Rule Route -> SQS', style: 'solid', protocol: 'SQS' },
      { id: 'sl7', from: 'n_eventbridge', to: 'n_sns', label: 'Rule Route -> SNS', style: 'solid', protocol: 'SNS' }
    ]
  },
  {
    id: 'template_aws_devops',
    title: 'AWS EKS Container DevOps & GitOps CI/CD Pipeline',
    description: 'End-to-end DevOps pipeline featuring GitHub Repository, AWS CodePipeline, CodeBuild, SonarQube, ECR, EKS Cluster with ArgoCD GitOps, and CloudWatch observability.',
    primaryProvider: 'aws',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    containers: [
      {
        id: 'c_aws_devops_toolchain',
        name: 'CI/CD Pipeline & Code Quality',
        provider: 'aws',
        type: 'resource_group',
        x: 60,
        y: 60,
        width: 860,
        height: 200,
        color: '#F97316'
      },
      {
        id: 'c_aws_eks_vpc',
        name: 'AWS Production EKS VPC (10.1.0.0/16)',
        provider: 'aws',
        type: 'vpc',
        x: 60,
        y: 290,
        width: 860,
        height: 250,
        color: '#FF9900'
      }
    ],
    nodes: [
      {
        id: 'n_devops_git',
        name: 'GitHub Source Code',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_git_repo',
        resourceType: 'generic_git_repo',
        x: 100,
        y: 110,
        containerId: 'c_aws_devops_toolchain',
        specs: { count: 1 }
      },
      {
        id: 'n_devops_pipeline',
        name: 'AWS CodePipeline',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_cicd',
        resourceType: 'generic_cicd',
        x: 280,
        y: 110,
        containerId: 'c_aws_devops_toolchain',
        specs: { count: 1 }
      },
      {
        id: 'n_devops_sonar',
        name: 'SonarQube Quality Gate',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_sonarqube',
        resourceType: 'generic_sonarqube',
        x: 460,
        y: 110,
        containerId: 'c_aws_devops_toolchain',
        specs: { count: 1 }
      },
      {
        id: 'n_devops_ecr',
        name: 'AWS ECR Container Registry',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_container_registry',
        resourceType: 'generic_container_registry',
        x: 660,
        y: 110,
        containerId: 'c_aws_devops_toolchain',
        specs: { count: 1 }
      },
      {
        id: 'n_devops_argocd',
        name: 'ArgoCD GitOps Engine',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_argocd_gitops',
        resourceType: 'generic_argocd_gitops',
        x: 160,
        y: 350,
        containerId: 'c_aws_eks_vpc',
        specs: { count: 1 }
      },
      {
        id: 'n_devops_eks',
        name: 'AWS EKS Kubernetes Cluster',
        provider: 'aws',
        category: 'container',
        iconKey: 'aws_eks',
        resourceType: 'aws_eks_cluster',
        x: 420,
        y: 350,
        containerId: 'c_aws_eks_vpc',
        specs: { instanceType: 't3.large', count: 3 }
      },
      {
        id: 'n_devops_cloudwatch',
        name: 'AWS CloudWatch Observability',
        provider: 'aws',
        category: 'security',
        iconKey: 'aws_cloudwatch',
        resourceType: 'aws_cloudwatch_metric_alarm',
        x: 680,
        y: 350,
        containerId: 'c_aws_eks_vpc',
        specs: { count: 1 }
      }
    ],
    links: [
      { id: 'dl1', from: 'n_devops_git', to: 'n_devops_pipeline', label: 'Webhook Push Trigger', style: 'solid', protocol: 'HTTPS' },
      { id: 'dl2', from: 'n_devops_pipeline', to: 'n_devops_sonar', label: 'SAST Scan', style: 'solid', protocol: 'HTTPS' },
      { id: 'dl3', from: 'n_devops_pipeline', to: 'n_devops_ecr', label: 'Push Image Tag', style: 'solid', protocol: 'Docker' },
      { id: 'dl4', from: 'n_devops_ecr', to: 'n_devops_argocd', label: 'Image Update Event', style: 'dashed', protocol: 'HTTPS' },
      { id: 'dl5', from: 'n_devops_argocd', to: 'n_devops_eks', label: 'Sync Manifests (K8s)', style: 'solid', protocol: 'gRPC' },
      { id: 'dl6', from: 'n_devops_eks', to: 'n_devops_cloudwatch', label: 'Metrics & Log Shipping', style: 'dashed', protocol: 'Internal' }
    ]
  },

  // ==========================================
  // AZURE TEMPLATES
  // ==========================================
  {
    id: 'template_azure_paas',
    title: 'Azure PaaS Web Application & Microservices',
    description: 'Fully managed Azure PaaS architecture with Azure Front Door CDN, App Gateway (WAF), App Service Web, Azure Functions, Azure Cosmos DB, Redis Cache, and Key Vault.',
    primaryProvider: 'azure',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    containers: [
      {
        id: 'c_az_vnet',
        name: 'Azure Virtual Network (vnet-prod-eastus)',
        provider: 'azure',
        type: 'resource_group',
        x: 60,
        y: 60,
        width: 860,
        height: 500,
        color: '#0078D4'
      }
    ],
    nodes: [
      {
        id: 'n_az_user',
        name: 'Global Web Users',
        provider: 'generic',
        category: 'networking',
        iconKey: 'generic_user',
        resourceType: 'generic_user',
        x: 100,
        y: 120,
        containerId: 'c_az_vnet',
        specs: { count: 8000 }
      },
      {
        id: 'n_az_frontdoor',
        name: 'Azure Front Door & CDN',
        provider: 'azure',
        category: 'networking',
        iconKey: 'azure_front_door',
        resourceType: 'azurerm_cdn_frontdoor_profile',
        x: 280,
        y: 120,
        containerId: 'c_az_vnet',
        specs: { count: 1 }
      },
      {
        id: 'n_az_appgw',
        name: 'App Gateway + WAF',
        provider: 'azure',
        category: 'networking',
        iconKey: 'azure_appgw',
        resourceType: 'azurerm_application_gateway',
        x: 480,
        y: 120,
        containerId: 'c_az_vnet',
        specs: { count: 1, isPublic: true }
      },
      {
        id: 'n_az_appservice',
        name: 'Azure App Service (Web Frontend)',
        provider: 'azure',
        category: 'compute',
        iconKey: 'azure_app_service',
        resourceType: 'azurerm_service_plan',
        x: 220,
        y: 300,
        containerId: 'c_az_vnet',
        specs: { instanceType: 'P1v2', count: 2 }
      },
      {
        id: 'n_az_func',
        name: 'Azure Functions (API Backend)',
        provider: 'azure',
        category: 'compute',
        iconKey: 'azure_functions',
        resourceType: 'azurerm_function_app',
        x: 480,
        y: 300,
        containerId: 'c_az_vnet',
        specs: { count: 2 }
      },
      {
        id: 'n_az_cosmos',
        name: 'Azure Cosmos DB NoSQL',
        provider: 'azure',
        category: 'database',
        iconKey: 'azure_cosmos',
        resourceType: 'azurerm_cosmosdb_account',
        x: 680,
        y: 300,
        containerId: 'c_az_vnet',
        specs: { count: 1, storageGb: 200 }
      },
      {
        id: 'n_az_redis',
        name: 'Azure Cache for Redis',
        provider: 'azure',
        category: 'database',
        iconKey: 'azure_redis',
        resourceType: 'azurerm_redis_cache',
        x: 350,
        y: 430,
        containerId: 'c_az_vnet',
        specs: { count: 1, storageGb: 13 }
      },
      {
        id: 'n_az_kv',
        name: 'Azure Key Vault Secrets',
        provider: 'azure',
        category: 'security',
        iconKey: 'azure_key_vault',
        resourceType: 'azurerm_key_vault',
        x: 680,
        y: 120,
        containerId: 'c_az_vnet',
        specs: { count: 1 }
      }
    ],
    links: [
      { id: 'azl1', from: 'n_az_user', to: 'n_az_frontdoor', label: 'HTTPS / 443', style: 'solid', protocol: 'HTTPS' },
      { id: 'azl2', from: 'n_az_frontdoor', to: 'n_az_appgw', label: 'Global Edge Routing', style: 'solid', protocol: 'HTTPS' },
      { id: 'azl3', from: 'n_az_appgw', to: 'n_az_appservice', label: 'Target Group HTTP:80', style: 'solid', protocol: 'HTTP' },
      { id: 'azl4', from: 'n_az_appgw', to: 'n_az_func', label: 'API Routing', style: 'solid', protocol: 'HTTPS' },
      { id: 'azl5', from: 'n_az_appservice', to: 'n_az_redis', label: 'Session Cache', style: 'solid', protocol: 'Redis' },
      { id: 'azl6', from: 'n_az_func', to: 'n_az_cosmos', label: 'Cosmos NoSQL SDK', style: 'solid', protocol: 'HTTPS' },
      { id: 'azl7', from: 'n_az_func', to: 'n_az_kv', label: 'Managed Identity Secrets', style: 'dashed', protocol: 'HTTPS' }
    ]
  },
  {
    id: 'template_azure_iaas',
    title: 'Azure Enterprise IaaS Landing Zone & Hybrid Network',
    description: 'Secure hybrid Azure IaaS infrastructure with ExpressRoute connection, Hub-and-Spoke VNet, Azure Firewall, Load Balancers, Linux VM Scale Sets, and Azure SQL Database.',
    primaryProvider: 'azure',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    containers: [
      {
        id: 'c_az_hub',
        name: 'Hub VNet (vnet-hub-security)',
        provider: 'azure',
        type: 'resource_group',
        x: 60,
        y: 60,
        width: 380,
        height: 480,
        color: '#0078D4'
      },
      {
        id: 'c_az_spoke',
        name: 'Spoke VNet (vnet-spoke-workloads)',
        provider: 'azure',
        type: 'resource_group',
        x: 480,
        y: 60,
        width: 440,
        height: 480,
        color: '#0284C7'
      }
    ],
    nodes: [
      {
        id: 'n_az_onprem',
        name: 'Corporate On-Premises',
        provider: 'generic',
        category: 'compute',
        iconKey: 'generic_onprem',
        resourceType: 'generic_onprem',
        x: 100,
        y: 120,
        containerId: 'c_az_hub',
        specs: { count: 1 }
      },
      {
        id: 'n_az_expressroute',
        name: 'Azure ExpressRoute Circuit',
        provider: 'azure',
        category: 'networking',
        iconKey: 'azure_expressroute',
        resourceType: 'azurerm_express_route_circuit',
        x: 260,
        y: 120,
        containerId: 'c_az_hub',
        specs: { count: 1 }
      },
      {
        id: 'n_az_firewall',
        name: 'Azure Central Firewall',
        provider: 'azure',
        category: 'security',
        iconKey: 'azure_firewall',
        resourceType: 'azurerm_firewall',
        x: 180,
        y: 320,
        containerId: 'c_az_hub',
        specs: { count: 1 }
      },
      {
        id: 'n_az_lb',
        name: 'Azure Internal Load Balancer',
        provider: 'azure',
        category: 'networking',
        iconKey: 'azure_load_balancer',
        resourceType: 'azurerm_lb',
        x: 520,
        y: 120,
        containerId: 'c_az_spoke',
        specs: { count: 1, isPublic: false }
      },
      {
        id: 'n_az_vm1',
        name: 'App Server VM #1',
        provider: 'azure',
        category: 'compute',
        iconKey: 'azure_vm',
        resourceType: 'azurerm_linux_virtual_machine',
        x: 520,
        y: 300,
        containerId: 'c_az_spoke',
        specs: { instanceType: 'Standard_D2s_v3', count: 1, storageGb: 128 }
      },
      {
        id: 'n_az_vm2',
        name: 'App Server VM #2',
        provider: 'azure',
        category: 'compute',
        iconKey: 'azure_vm',
        resourceType: 'azurerm_linux_virtual_machine',
        x: 720,
        y: 300,
        containerId: 'c_az_spoke',
        specs: { instanceType: 'Standard_D2s_v3', count: 1, storageGb: 128 }
      },
      {
        id: 'n_az_sql',
        name: 'Azure SQL Database',
        provider: 'azure',
        category: 'database',
        iconKey: 'azure_sql',
        resourceType: 'azurerm_mssql_database',
        x: 620,
        y: 430,
        containerId: 'c_az_spoke',
        specs: { tier: 'General Purpose', storageGb: 250, count: 1 }
      }
    ],
    links: [
      { id: 'ia1', from: 'n_az_onprem', to: 'n_az_expressroute', label: 'Private Fiber Connection', style: 'solid', protocol: 'Internal' },
      { id: 'ia2', from: 'n_az_expressroute', to: 'n_az_firewall', label: 'VNet Gateway Peering', style: 'solid', protocol: 'Internal' },
      { id: 'ia3', from: 'n_az_firewall', to: 'n_az_lb', label: 'VNet Peering Traffic', style: 'solid', protocol: 'Internal' },
      { id: 'ia4', from: 'n_az_lb', to: 'n_az_vm1', label: 'TCP 8080', style: 'solid', protocol: 'TCP' },
      { id: 'ia5', from: 'n_az_lb', to: 'n_az_vm2', label: 'TCP 8080', style: 'solid', protocol: 'TCP' },
      { id: 'ia6', from: 'n_az_vm1', to: 'n_az_sql', label: 'TDS / SQL 1433', style: 'solid', protocol: 'SQL' },
      { id: 'ia7', from: 'n_az_vm2', to: 'n_az_sql', label: 'TDS / SQL 1433', style: 'solid', protocol: 'SQL' }
    ]
  },

  // ==========================================
  // GCP TEMPLATES
  // ==========================================
  {
    id: 'template_gcp_ai',
    title: 'GCP Modern Microservices & Vertex AI Pipeline (PaaS)',
    description: 'GCP Cloud Run frontend connected to GKE microservices, Vertex AI model endpoints, Cloud SQL PostgreSQL, and BigQuery analytics.',
    primaryProvider: 'gcp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    containers: [
      {
        id: 'c_gcp_vpc',
        name: 'GCP VPC Network (prod-vpc)',
        provider: 'gcp',
        type: 'vpc',
        x: 60,
        y: 60,
        width: 860,
        height: 480,
        color: '#4285F4'
      }
    ],
    nodes: [
      {
        id: 'n_cloud_run',
        name: 'Cloud Run Web Gateway',
        provider: 'gcp',
        category: 'compute',
        iconKey: 'gcp_cloud_run',
        resourceType: 'google_cloud_run_v2_service',
        x: 120,
        y: 200,
        containerId: 'c_gcp_vpc',
        specs: { count: 2, region: 'us-central1' }
      },
      {
        id: 'n_gke',
        name: 'GKE Microservices Cluster',
        provider: 'gcp',
        category: 'container',
        iconKey: 'gcp_gke',
        resourceType: 'google_container_cluster',
        x: 360,
        y: 140,
        containerId: 'c_gcp_vpc',
        specs: { instanceType: 'e2-standard-4', count: 3 }
      },
      {
        id: 'n_vertex',
        name: 'Vertex AI Model Inference',
        provider: 'gcp',
        category: 'ai',
        iconKey: 'gcp_vertex_ai',
        resourceType: 'google_vertex_ai_endpoint',
        x: 620,
        y: 140,
        containerId: 'c_gcp_vpc',
        specs: { count: 2 }
      },
      {
        id: 'n_cloudsql',
        name: 'Cloud SQL Postgres',
        provider: 'gcp',
        category: 'database',
        iconKey: 'gcp_cloud_sql',
        resourceType: 'google_sql_database_instance',
        x: 360,
        y: 340,
        containerId: 'c_gcp_vpc',
        specs: { instanceType: 'db-custom-2-7680', count: 1, storageGb: 100 }
      },
      {
        id: 'n_bigquery',
        name: 'BigQuery Data Warehouse',
        provider: 'gcp',
        category: 'analytics',
        iconKey: 'gcp_bigquery',
        resourceType: 'google_bigquery_dataset',
        x: 620,
        y: 340,
        containerId: 'c_gcp_vpc',
        specs: { storageGb: 2000 }
      }
    ],
    links: [
      { id: 'gl1', from: 'n_cloud_run', to: 'n_gke', label: 'gRPC / internal', style: 'solid', protocol: 'gRPC' },
      { id: 'gl2', from: 'n_gke', to: 'n_vertex', label: 'REST AI Inference', style: 'solid', protocol: 'HTTPS' },
      { id: 'gl3', from: 'n_gke', to: 'n_cloudsql', label: 'Cloud SQL Proxy', style: 'solid', protocol: 'SQL' },
      { id: 'gl4', from: 'n_cloudsql', to: 'n_bigquery', label: 'Federated Query / CDC', style: 'dashed', protocol: 'Internal' }
    ]
  },
  {
    id: 'template_gcp_paas_analytics',
    title: 'GCP Real-Time Streaming & BigQuery Analytics (PaaS)',
    description: 'Serverless streaming ingestion & real-time analytics mesh using Cloud Pub/Sub, Dataflow (Apache Beam), BigQuery ML, Cloud Storage Data Lake, and Vertex AI.',
    primaryProvider: 'gcp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    containers: [
      {
        id: 'c_gcp_analytics_vpc',
        name: 'GCP Analytics Network (us-central1)',
        provider: 'gcp',
        type: 'vpc',
        x: 60,
        y: 60,
        width: 860,
        height: 480,
        color: '#4285F4'
      }
    ],
    nodes: [
      {
        id: 'n_gcp_iot',
        name: 'IoT & Web Stream Sources',
        provider: 'generic',
        category: 'networking',
        iconKey: 'generic_user',
        resourceType: 'generic_user',
        x: 100,
        y: 180,
        containerId: 'c_gcp_analytics_vpc',
        specs: { count: 50000 }
      },
      {
        id: 'n_pubsub',
        name: 'Cloud Pub/Sub Topics',
        provider: 'gcp',
        category: 'integration',
        iconKey: 'gcp_pubsub',
        resourceType: 'google_pubsub_topic',
        x: 300,
        y: 180,
        containerId: 'c_gcp_analytics_vpc',
        specs: { count: 1 }
      },
      {
        id: 'n_dataflow',
        name: 'Cloud Dataflow Pipeline',
        provider: 'gcp',
        category: 'analytics',
        iconKey: 'gcp_dataflow',
        resourceType: 'google_dataflow_job',
        x: 500,
        y: 180,
        containerId: 'c_gcp_analytics_vpc',
        specs: { count: 2 }
      },
      {
        id: 'n_gcs',
        name: 'Cloud Storage Data Lake',
        provider: 'gcp',
        category: 'storage',
        iconKey: 'gcp_gcs',
        resourceType: 'google_storage_bucket',
        x: 700,
        y: 120,
        containerId: 'c_gcp_analytics_vpc',
        specs: { storageGb: 2000 }
      },
      {
        id: 'n_bq_warehouse',
        name: 'BigQuery Data Warehouse',
        provider: 'gcp',
        category: 'analytics',
        iconKey: 'gcp_bigquery',
        resourceType: 'google_bigquery_dataset',
        x: 700,
        y: 280,
        containerId: 'c_gcp_analytics_vpc',
        specs: { storageGb: 5000 }
      },
      {
        id: 'n_vertex_ml',
        name: 'Vertex AI Model Training',
        provider: 'gcp',
        category: 'ai',
        iconKey: 'gcp_vertex_ai',
        resourceType: 'google_vertex_ai_endpoint',
        x: 500,
        y: 360,
        containerId: 'c_gcp_analytics_vpc',
        specs: { count: 1 }
      }
    ],
    links: [
      { id: 'gpl1', from: 'n_gcp_iot', to: 'n_pubsub', label: 'gRPC / Streaming', style: 'solid', protocol: 'gRPC' },
      { id: 'gpl2', from: 'n_pubsub', to: 'n_dataflow', label: 'Subscription Stream', style: 'solid', protocol: 'Internal' },
      { id: 'gpl3', from: 'n_dataflow', to: 'n_gcs', label: 'Raw Archive Parquet', style: 'dashed', protocol: 'Internal' },
      { id: 'gpl4', from: 'n_dataflow', to: 'n_bq_warehouse', label: 'Streaming Insert', style: 'solid', protocol: 'HTTPS' },
      { id: 'gpl5', from: 'n_bq_warehouse', to: 'n_vertex_ml', label: 'BigQuery ML Feature Store', style: 'dashed', protocol: 'Internal' }
    ]
  },
  {
    id: 'template_gcp_devops',
    title: 'GCP GKE Native DevOps & GitOps CI/CD Pipeline',
    description: 'Cloud native DevOps pipeline with Source Repository, Cloud Build, Artifact Registry, GKE Cluster, ArgoCD GitOps, Prometheus, and Cloud Logging.',
    primaryProvider: 'gcp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    containers: [
      {
        id: 'c_gcp_devops_toolchain',
        name: 'GCP CI/CD Pipeline & Artifacts',
        provider: 'gcp',
        type: 'vpc',
        x: 60,
        y: 60,
        width: 860,
        height: 200,
        color: '#4285F4'
      },
      {
        id: 'c_gcp_gke_vpc',
        name: 'GCP Production GKE VPC (10.3.0.0/16)',
        provider: 'gcp',
        type: 'vpc',
        x: 60,
        y: 290,
        width: 860,
        height: 250,
        color: '#34A853'
      }
    ],
    nodes: [
      {
        id: 'n_gcp_git',
        name: 'Git Code Repository',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_git_repo',
        resourceType: 'generic_git_repo',
        x: 100,
        y: 110,
        containerId: 'c_gcp_devops_toolchain',
        specs: { count: 1 }
      },
      {
        id: 'n_cloud_build',
        name: 'GCP Cloud Build',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_cicd',
        resourceType: 'generic_cicd',
        x: 320,
        y: 110,
        containerId: 'c_gcp_devops_toolchain',
        specs: { count: 1 }
      },
      {
        id: 'n_artifact_reg',
        name: 'Artifact Registry',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_container_registry',
        resourceType: 'generic_container_registry',
        x: 580,
        y: 110,
        containerId: 'c_gcp_devops_toolchain',
        specs: { count: 1 }
      },
      {
        id: 'n_gcp_argocd',
        name: 'ArgoCD Controller',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_argocd_gitops',
        resourceType: 'generic_argocd_gitops',
        x: 160,
        y: 350,
        containerId: 'c_gcp_gke_vpc',
        specs: { count: 1 }
      },
      {
        id: 'n_gke_prod',
        name: 'GKE Production Cluster',
        provider: 'gcp',
        category: 'container',
        iconKey: 'gcp_gke',
        resourceType: 'google_container_cluster',
        x: 440,
        y: 350,
        containerId: 'c_gcp_gke_vpc',
        specs: { instanceType: 'e2-standard-4', count: 3 }
      },
      {
        id: 'n_gcp_logging',
        name: 'Cloud Logging & Metrics',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_grafana_metrics',
        resourceType: 'generic_grafana_metrics',
        x: 700,
        y: 350,
        containerId: 'c_gcp_gke_vpc',
        specs: { count: 1 }
      }
    ],
    links: [
      { id: 'gdl1', from: 'n_gcp_git', to: 'n_cloud_build', label: 'Push Event Trigger', style: 'solid', protocol: 'HTTPS' },
      { id: 'gdl2', from: 'n_cloud_build', to: 'n_artifact_reg', label: 'Push Image & Helm Charts', style: 'solid', protocol: 'Docker' },
      { id: 'gdl3', from: 'n_artifact_reg', to: 'n_gcp_argocd', label: 'Helm Chart Sync Event', style: 'dashed', protocol: 'HTTPS' },
      { id: 'gdl4', from: 'n_gcp_argocd', to: 'n_gke_prod', label: 'K8s Manifest Deploy', style: 'solid', protocol: 'gRPC' },
      { id: 'gdl5', from: 'n_gke_prod', to: 'n_gcp_logging', label: 'Prometheus Scrape / Logs', style: 'dashed', protocol: 'Internal' }
    ]
  },

  // ==========================================
  // OCI (ORACLE CLOUD) TEMPLATES
  // ==========================================
  {
    id: 'template_oci_iaas',
    title: 'OCI Enterprise High-Performance IaaS Network',
    description: 'Oracle Cloud Infrastructure enterprise design with FastConnect, VCN, Public Load Balancer, Private Compute Instances with Block Volumes, and Exadata Database.',
    primaryProvider: 'oci',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    containers: [
      {
        id: 'c_oci_vcn',
        name: 'OCI Virtual Cloud Network (VCN 10.0.0.0/16)',
        provider: 'oci',
        type: 'compartment',
        x: 60,
        y: 60,
        width: 880,
        height: 520,
        color: '#F80000'
      },
      {
        id: 'c_oci_pub_sub',
        name: 'Public Subnet (10.0.1.0/24) - LB Subnet',
        provider: 'oci',
        type: 'subnet',
        x: 100,
        y: 120,
        width: 800,
        height: 120,
        color: '#3B82F6',
        isPublicSubnet: true
      },
      {
        id: 'c_oci_priv_sub',
        name: 'Private Subnet (10.0.2.0/24) - Workloads & Exadata',
        provider: 'oci',
        type: 'subnet',
        x: 100,
        y: 270,
        width: 800,
        height: 270,
        color: '#10B981',
        isPublicSubnet: false
      }
    ],
    nodes: [
      {
        id: 'n_oci_onprem',
        name: 'Corporate Data Center',
        provider: 'generic',
        category: 'compute',
        iconKey: 'generic_onprem',
        resourceType: 'generic_onprem',
        x: 140,
        y: 150,
        containerId: 'c_oci_pub_sub',
        specs: { count: 1 }
      },
      {
        id: 'n_oci_fc',
        name: 'OCI FastConnect',
        provider: 'oci',
        category: 'networking',
        iconKey: 'oci_fastconnect',
        resourceType: 'oci_core_fast_connect_provider_service',
        x: 360,
        y: 150,
        containerId: 'c_oci_pub_sub',
        specs: { count: 1 }
      },
      {
        id: 'n_oci_lb',
        name: 'OCI Public Load Balancer',
        provider: 'oci',
        category: 'networking',
        iconKey: 'oci_load_balancer',
        resourceType: 'oci_load_balancer_load_balancer',
        x: 620,
        y: 150,
        containerId: 'c_oci_pub_sub',
        specs: { count: 1, isPublic: true }
      },
      {
        id: 'n_oci_comp1',
        name: 'Compute Instance #1',
        provider: 'oci',
        category: 'compute',
        iconKey: 'oci_compute',
        resourceType: 'oci_core_instance',
        x: 200,
        y: 320,
        containerId: 'c_oci_priv_sub',
        specs: { instanceType: 'VM.Standard3.Flex', count: 1 }
      },
      {
        id: 'n_oci_comp2',
        name: 'Compute Instance #2',
        provider: 'oci',
        category: 'compute',
        iconKey: 'oci_compute',
        resourceType: 'oci_core_instance',
        x: 420,
        y: 320,
        containerId: 'c_oci_priv_sub',
        specs: { instanceType: 'VM.Standard3.Flex', count: 1 }
      },
      {
        id: 'n_oci_bv',
        name: 'OCI Block Volume',
        provider: 'oci',
        category: 'storage',
        iconKey: 'oci_block_volume',
        resourceType: 'oci_core_volume',
        x: 310,
        y: 440,
        containerId: 'c_oci_priv_sub',
        specs: { storageGb: 500 }
      },
      {
        id: 'n_oci_exadata',
        name: 'OCI Exadata DB Service',
        provider: 'oci',
        category: 'database',
        iconKey: 'oci_exadata',
        resourceType: 'oci_database_exadata_infrastructure',
        x: 660,
        y: 320,
        containerId: 'c_oci_priv_sub',
        specs: { count: 1, storageGb: 2000 }
      }
    ],
    links: [
      { id: 'ocil1', from: 'n_oci_onprem', to: 'n_oci_fc', label: '10Gbps Direct Link', style: 'solid', protocol: 'Internal' },
      { id: 'ocil2', from: 'n_oci_fc', to: 'n_oci_lb', label: 'VCN Routing', style: 'solid', protocol: 'Internal' },
      { id: 'ocil3', from: 'n_oci_lb', to: 'n_oci_comp1', label: 'Backend Set HTTP:80', style: 'solid', protocol: 'HTTP' },
      { id: 'ocil4', from: 'n_oci_lb', to: 'n_oci_comp2', label: 'Backend Set HTTP:80', style: 'solid', protocol: 'HTTP' },
      { id: 'ocil5', from: 'n_oci_comp1', to: 'n_oci_bv', label: 'iSCSI Attachment', style: 'dashed', protocol: 'Internal' },
      { id: 'ocil6', from: 'n_oci_comp1', to: 'n_oci_exadata', label: 'Oracle Net 1521', style: 'solid', protocol: 'SQL' },
      { id: 'ocil7', from: 'n_oci_comp2', to: 'n_oci_exadata', label: 'Oracle Net 1521', style: 'solid', protocol: 'SQL' }
    ]
  },
  {
    id: 'template_oci_paas',
    title: 'OCI Cloud-Native PaaS & Microservices Stack',
    description: 'Modern serverless & containerized PaaS architecture using OCI API Gateway, OCI Functions, OKE (Kubernetes), OCI MySQL HeatWave, OCI Streaming, and OCI Vault.',
    primaryProvider: 'oci',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    containers: [
      {
        id: 'c_oci_paas_vcn',
        name: 'OCI Compartment (Production VCN 10.4.0.0/16)',
        provider: 'oci',
        type: 'compartment',
        x: 60,
        y: 60,
        width: 860,
        height: 500,
        color: '#F80000'
      }
    ],
    nodes: [
      {
        id: 'n_oci_client',
        name: 'Web & Mobile Clients',
        provider: 'generic',
        category: 'networking',
        iconKey: 'generic_user',
        resourceType: 'generic_user',
        x: 100,
        y: 120,
        containerId: 'c_oci_paas_vcn',
        specs: { count: 5000 }
      },
      {
        id: 'n_oci_waf',
        name: 'OCI WAF Protection',
        provider: 'oci',
        category: 'security',
        iconKey: 'oci_waf',
        resourceType: 'oci_waf_web_app_firewall',
        x: 280,
        y: 120,
        containerId: 'c_oci_paas_vcn',
        specs: { count: 1 }
      },
      {
        id: 'n_oci_apigw',
        name: 'OCI API Gateway',
        provider: 'oci',
        category: 'networking',
        iconKey: 'oci_api_gateway',
        resourceType: 'oci_apigateway_gateway',
        x: 480,
        y: 120,
        containerId: 'c_oci_paas_vcn',
        specs: { count: 1 }
      },
      {
        id: 'n_oci_fn',
        name: 'OCI Functions Serverless',
        provider: 'oci',
        category: 'compute',
        iconKey: 'oci_functions',
        resourceType: 'oci_functions_function',
        x: 280,
        y: 300,
        containerId: 'c_oci_paas_vcn',
        specs: { count: 1 }
      },
      {
        id: 'n_oci_oke',
        name: 'OCI OKE Kubernetes Cluster',
        provider: 'oci',
        category: 'container',
        iconKey: 'oci_oke',
        resourceType: 'oci_containerengine_cluster',
        x: 480,
        y: 300,
        containerId: 'c_oci_paas_vcn',
        specs: { instanceType: 'VM.Standard.E4.Flex', count: 3 }
      },
      {
        id: 'n_oci_heatwave',
        name: 'OCI MySQL HeatWave',
        provider: 'oci',
        category: 'database',
        iconKey: 'oci_mysql_heatwave',
        resourceType: 'oci_mysql_mysql_db_system',
        x: 680,
        y: 300,
        containerId: 'c_oci_paas_vcn',
        specs: { count: 1, storageGb: 250 }
      },
      {
        id: 'n_oci_stream',
        name: 'OCI Streaming Service',
        provider: 'oci',
        category: 'integration',
        iconKey: 'oci_streaming',
        resourceType: 'oci_streaming_stream',
        x: 380,
        y: 430,
        containerId: 'c_oci_paas_vcn',
        specs: { count: 1 }
      },
      {
        id: 'n_oci_vault',
        name: 'OCI Vault Key Secrets',
        provider: 'oci',
        category: 'security',
        iconKey: 'oci_vault',
        resourceType: 'oci_kms_vault',
        x: 680,
        y: 120,
        containerId: 'c_oci_paas_vcn',
        specs: { count: 1 }
      }
    ],
    links: [
      { id: 'opl1', from: 'n_oci_client', to: 'n_oci_waf', label: 'HTTPS / 443', style: 'solid', protocol: 'HTTPS' },
      { id: 'opl2', from: 'n_oci_waf', to: 'n_oci_apigw', label: 'Filtered Traffic', style: 'solid', protocol: 'HTTPS' },
      { id: 'opl3', from: 'n_oci_apigw', to: 'n_oci_fn', label: 'Fn Trigger', style: 'solid', protocol: 'HTTPS' },
      { id: 'opl4', from: 'n_oci_apigw', to: 'n_oci_oke', label: 'Microservices Route', style: 'solid', protocol: 'gRPC' },
      { id: 'opl5', from: 'n_oci_oke', to: 'n_oci_heatwave', label: 'MySQL Port 3306', style: 'solid', protocol: 'SQL' },
      { id: 'opl6', from: 'n_oci_oke', to: 'n_oci_stream', label: 'Kafka Event Producer', style: 'solid', protocol: 'AMQP' },
      { id: 'opl7', from: 'n_oci_fn', to: 'n_oci_vault', label: 'Secrets Decrypt', style: 'dashed', protocol: 'HTTPS' }
    ]
  },
  {
    id: 'template_oci_devops',
    title: 'OCI DevOps CI/CD & OKE GitOps Pipeline',
    description: 'Oracle Cloud Infrastructure automated CI/CD pipeline with OCI Code Repository, OCI Build Pipeline, OCI Artifact Registry, OKE Deployment, and Logging/Monitoring.',
    primaryProvider: 'oci',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    containers: [
      {
        id: 'c_oci_devops_toolchain',
        name: 'OCI DevOps Service & Artifacts',
        provider: 'oci',
        type: 'compartment',
        x: 60,
        y: 60,
        width: 860,
        height: 200,
        color: '#F80000'
      },
      {
        id: 'c_oci_oke_vpc',
        name: 'OCI OKE Production VCN (10.5.0.0/16)',
        provider: 'oci',
        type: 'compartment',
        x: 60,
        y: 290,
        width: 860,
        height: 250,
        color: '#D97706'
      }
    ],
    nodes: [
      {
        id: 'n_oci_repo',
        name: 'OCI Code Repository',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_git_repo',
        resourceType: 'generic_git_repo',
        x: 100,
        y: 110,
        containerId: 'c_oci_devops_toolchain',
        specs: { count: 1 }
      },
      {
        id: 'n_oci_build',
        name: 'OCI Build Pipeline',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_cicd',
        resourceType: 'generic_cicd',
        x: 320,
        y: 110,
        containerId: 'c_oci_devops_toolchain',
        specs: { count: 1 }
      },
      {
        id: 'n_oci_reg',
        name: 'OCI Container Registry',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_container_registry',
        resourceType: 'generic_container_registry',
        x: 580,
        y: 110,
        containerId: 'c_oci_devops_toolchain',
        specs: { count: 1 }
      },
      {
        id: 'n_oci_deploy',
        name: 'OCI Deployment Pipeline',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_argocd_gitops',
        resourceType: 'generic_argocd_gitops',
        x: 160,
        y: 350,
        containerId: 'c_oci_oke_vpc',
        specs: { count: 1 }
      },
      {
        id: 'n_oci_oke_prod',
        name: 'OKE Production Cluster',
        provider: 'oci',
        category: 'container',
        iconKey: 'oci_oke',
        resourceType: 'oci_containerengine_cluster',
        x: 440,
        y: 350,
        containerId: 'c_oci_oke_vpc',
        specs: { instanceType: 'VM.Standard.E4.Flex', count: 3 }
      },
      {
        id: 'n_oci_monitor',
        name: 'OCI Logging & Metrics',
        provider: 'generic',
        category: 'devops',
        iconKey: 'generic_grafana_metrics',
        resourceType: 'generic_grafana_metrics',
        x: 700,
        y: 350,
        containerId: 'c_oci_oke_vpc',
        specs: { count: 1 }
      }
    ],
    links: [
      { id: 'odl1', from: 'n_oci_repo', to: 'n_oci_build', label: 'Commit Webhook', style: 'solid', protocol: 'HTTPS' },
      { id: 'odl2', from: 'n_oci_build', to: 'n_oci_reg', label: 'Push Image Manifest', style: 'solid', protocol: 'Docker' },
      { id: 'odl3', from: 'n_oci_reg', to: 'n_oci_deploy', label: 'Artifact Event Trigger', style: 'dashed', protocol: 'HTTPS' },
      { id: 'odl4', from: 'n_oci_deploy', to: 'n_oci_oke_prod', label: 'Apply K8s Manifests', style: 'solid', protocol: 'gRPC' },
      { id: 'odl5', from: 'n_oci_oke_prod', to: 'n_oci_monitor', label: 'Log & Metric Exporter', style: 'dashed', protocol: 'Internal' }
    ]
  },

  // ==========================================
  // MULTI-CLOUD TEMPLATES
  // ==========================================
  {
    id: 'template_multicloud_hybrid',
    title: 'Multi-Cloud Enterprise Setup (AWS + Azure + GCP + OCI)',
    description: 'Hybrid multi-cloud infrastructure leveraging AWS for Edge & Compute, Azure for Active Directory & OpenAI, GCP for BigQuery AI, and OCI for Autonomous Data Warehouse.',
    primaryProvider: 'aws',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    containers: [
      {
        id: 'mc_aws',
        name: 'AWS Cloud Region (us-east-1)',
        provider: 'aws',
        type: 'vpc',
        x: 40,
        y: 60,
        width: 400,
        height: 220,
        color: '#FF9900'
      },
      {
        id: 'mc_azure',
        name: 'Azure Resource Group (East US)',
        provider: 'azure',
        type: 'resource_group',
        x: 480,
        y: 60,
        width: 400,
        height: 220,
        color: '#0078D4'
      },
      {
        id: 'mc_gcp',
        name: 'GCP Project (us-central1)',
        provider: 'gcp',
        type: 'vpc',
        x: 40,
        y: 310,
        width: 400,
        height: 220,
        color: '#4285F4'
      },
      {
        id: 'mc_oci',
        name: 'OCI Compartment (us-ashburn-1)',
        provider: 'oci',
        type: 'compartment',
        x: 480,
        y: 310,
        width: 400,
        height: 220,
        color: '#F80000'
      }
    ],
    nodes: [
      {
        id: 'mn_aws_ec2',
        name: 'AWS App Compute',
        provider: 'aws',
        category: 'compute',
        iconKey: 'aws_ec2',
        resourceType: 'aws_instance',
        x: 80,
        y: 120,
        containerId: 'mc_aws',
        specs: { instanceType: 't3.large', count: 2 }
      },
      {
        id: 'mn_aws_s3',
        name: 'AWS Data Lake S3',
        provider: 'aws',
        category: 'storage',
        iconKey: 'aws_s3',
        resourceType: 'aws_s3_bucket',
        x: 260,
        y: 120,
        containerId: 'mc_aws',
        specs: { storageGb: 1000 }
      },
      {
        id: 'mn_az_openai',
        name: 'Azure OpenAI GPT-4',
        provider: 'azure',
        category: 'ai',
        iconKey: 'azure_openai',
        resourceType: 'azurerm_cognitive_account',
        x: 520,
        y: 120,
        containerId: 'mc_azure',
        specs: { count: 1 }
      },
      {
        id: 'mn_az_aks',
        name: 'Azure AKS Worker Cluster',
        provider: 'azure',
        category: 'container',
        iconKey: 'azure_aks',
        resourceType: 'azurerm_kubernetes_cluster',
        x: 700,
        y: 120,
        containerId: 'mc_azure',
        specs: { instanceType: 'Standard_D2s_v3', count: 3 }
      },
      {
        id: 'mn_gcp_bq',
        name: 'GCP BigQuery ML Analytics',
        provider: 'gcp',
        category: 'analytics',
        iconKey: 'gcp_bigquery',
        resourceType: 'google_bigquery_dataset',
        x: 120,
        y: 370,
        containerId: 'mc_gcp',
        specs: { storageGb: 2000 }
      },
      {
        id: 'mn_oci_autodb',
        name: 'OCI Autonomous Database',
        provider: 'oci',
        category: 'database',
        iconKey: 'oci_autonomous_db',
        resourceType: 'oci_database_autonomous_database',
        x: 560,
        y: 370,
        containerId: 'mc_oci',
        specs: { storageGb: 1000 }
      }
    ],
    links: [
      { id: 'ml1', from: 'mn_aws_ec2', to: 'mn_az_openai', label: 'Cross-Cloud API Key', style: 'dashed', protocol: 'HTTPS' },
      { id: 'ml2', from: 'mn_aws_s3', to: 'mn_gcp_bq', label: 'BigQuery Storage Transfer', style: 'dashed', protocol: 'Internal' },
      { id: 'ml3', from: 'mn_aws_ec2', to: 'mn_oci_autodb', label: 'FastConnect / Peering', style: 'solid', protocol: 'SQL' }
    ]
  }
];

