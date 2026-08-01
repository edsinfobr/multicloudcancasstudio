import { CloudIconDefinition } from '../types';

export const CLOUD_ICONS: CloudIconDefinition[] = [
  // ==========================================
  // AWS (Amazon Web Services) - Brand Color: #FF9900 / #232F3E
  // ==========================================
  {
    key: 'aws_ec2',
    name: 'AWS EC2 Instance',
    provider: 'aws',
    category: 'compute',
    brandColor: '#FF9900',
    defaultResourceType: 'aws_instance',
    defaultSpecs: { instanceType: 't3.medium', count: 2, storageGb: 30, region: 'us-east-1' },
    description: 'Virtual Server in the Cloud',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#FF9900" fill-opacity="0.15" stroke="#FF9900" stroke-width="2"/>
      <rect x="14" y="14" width="36" height="36" rx="6" fill="#FF9900"/>
      <path d="M22 26H42M22 32H42M22 38H34" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <circle cx="40" cy="38" r="2" fill="white"/>
    </svg>`,
  },
  {
    key: 'aws_lambda',
    name: 'AWS Lambda',
    provider: 'aws',
    category: 'compute',
    brandColor: '#FF9900',
    defaultResourceType: 'aws_lambda_function',
    defaultSpecs: { count: 1, hoursPerMonth: 730, region: 'us-east-1' },
    description: 'Serverless Compute Service',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#FF9900" fill-opacity="0.15" stroke="#FF9900" stroke-width="2"/>
      <path d="M20 16L32 48M28 16H44L32 48H20" stroke="#FF9900" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'aws_eks',
    name: 'AWS EKS Container',
    provider: 'aws',
    category: 'container',
    brandColor: '#FF9900',
    defaultResourceType: 'aws_eks_cluster',
    defaultSpecs: { instanceType: 't3.large', count: 3, region: 'us-east-1' },
    description: 'Managed Kubernetes Service',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#FF9900" fill-opacity="0.15" stroke="#FF9900" stroke-width="2"/>
      <path d="M32 14L48 23V41L32 50L16 41V23L32 14Z" fill="#FF9900"/>
      <circle cx="32" cy="32" r="6" fill="white"/>
    </svg>`,
  },
  {
    key: 'aws_s3',
    name: 'AWS S3 Bucket',
    provider: 'aws',
    category: 'storage',
    brandColor: '#3B82F6',
    defaultResourceType: 'aws_s3_bucket',
    defaultSpecs: { storageGb: 500, transferGb: 100, region: 'us-east-1' },
    description: 'Scalable Cloud Storage',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#3B82F6" fill-opacity="0.15" stroke="#3B82F6" stroke-width="2"/>
      <path d="M16 22C16 18.6863 23.1634 16 32 16C40.8366 16 48 18.6863 48 22M16 22V42C16 45.3137 23.1634 48 32 48C40.8366 48 48 45.3137 48 42V22M16 22C16 25.3137 23.1634 28 32 28C40.8366 28 48 25.3137 48 22M16 32C16 35.3137 23.1634 38 32 38C40.8366 38 48 35.3137 48 32" stroke="#3B82F6" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'aws_rds',
    name: 'AWS RDS Database',
    provider: 'aws',
    category: 'database',
    brandColor: '#2563EB',
    defaultResourceType: 'aws_db_instance',
    defaultSpecs: { instanceType: 'db.r6g.xlarge', count: 2, storageGb: 200, engine: 'postgres' },
    description: 'Managed Relational Database',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#2563EB" fill-opacity="0.15" stroke="#2563EB" stroke-width="2"/>
      <ellipse cx="32" cy="20" rx="16" ry="6" fill="#2563EB"/>
      <path d="M16 20V44C16 47.3137 23.1634 50 32 50C40.8366 50 48 47.3137 48 44V20" stroke="#2563EB" stroke-width="3"/>
      <path d="M16 32C16 35.3137 23.1634 38 32 38C40.8366 38 48 35.3137 48 32" stroke="#2563EB" stroke-width="2" stroke-dasharray="2 2"/>
    </svg>`,
  },
  {
    key: 'aws_dynamodb',
    name: 'AWS DynamoDB',
    provider: 'aws',
    category: 'database',
    brandColor: '#2563EB',
    defaultResourceType: 'aws_dynamodb_table',
    defaultSpecs: { storageGb: 50, count: 1 },
    description: 'NoSQL Key-Value Database',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#2563EB" fill-opacity="0.15" stroke="#2563EB" stroke-width="2"/>
      <path d="M32 16L48 24V40L32 48L16 40V24L32 16Z" stroke="#2563EB" stroke-width="3"/>
      <path d="M32 24L40 28V36L32 40L24 36V28L32 24Z" fill="#2563EB"/>
    </svg>`,
  },
  {
    key: 'aws_alb',
    name: 'AWS Load Balancer (ALB)',
    provider: 'aws',
    category: 'networking',
    brandColor: '#8B5CF6',
    defaultResourceType: 'aws_lb',
    defaultSpecs: { count: 1, isPublic: true },
    description: 'Application Load Balancer',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#8B5CF6" fill-opacity="0.15" stroke="#8B5CF6" stroke-width="2"/>
      <circle cx="20" cy="32" r="6" fill="#8B5CF6"/>
      <circle cx="44" cy="20" r="6" fill="#8B5CF6"/>
      <circle cx="44" cy="44" r="6" fill="#8B5CF6"/>
      <path d="M26 32H34M34 32V20H38M34 32V44H38" stroke="#8B5CF6" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'aws_cloudfront',
    name: 'AWS CloudFront CDN',
    provider: 'aws',
    category: 'networking',
    brandColor: '#8B5CF6',
    defaultResourceType: 'aws_cloudfront_distribution',
    defaultSpecs: { transferGb: 1000 },
    description: 'Global Content Delivery Network',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#8B5CF6" fill-opacity="0.15" stroke="#8B5CF6" stroke-width="2"/>
      <circle cx="32" cy="32" r="16" stroke="#8B5CF6" stroke-width="3"/>
      <path d="M16 32H48M32 16C36 21 38 26.5 38 32C38 37.5 36 43 32 48C28 43 26 37.5 26 32C26 26.5 28 21 32 16Z" stroke="#8B5CF6" stroke-width="2"/>
    </svg>`,
  },
  {
    key: 'aws_route53',
    name: 'AWS Route 53',
    provider: 'aws',
    category: 'networking',
    brandColor: '#8B5CF6',
    defaultResourceType: 'aws_route53_zone',
    defaultSpecs: { count: 1 },
    description: 'DNS & Domain Routing',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#8B5CF6" fill-opacity="0.15" stroke="#8B5CF6" stroke-width="2"/>
      <path d="M32 16L46 44H18L32 16Z" stroke="#8B5CF6" stroke-width="3" fill="none"/>
      <text x="32" y="38" font-size="14" font-weight="bold" fill="#8B5CF6" text-anchor="middle">53</text>
    </svg>`,
  },
  {
    key: 'aws_bedrock',
    name: 'AWS Bedrock / AI',
    provider: 'aws',
    category: 'ai',
    brandColor: '#EC4899',
    defaultResourceType: 'aws_bedrock_custom_model',
    defaultSpecs: { count: 1 },
    description: 'Generative AI Foundation Models',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <path d="M32 16L36 28L48 32L36 36L32 48L28 36L16 32L28 28L32 16Z" fill="#EC4899"/>
    </svg>`,
  },
  {
    key: 'aws_vpc',
    name: 'AWS VPC',
    provider: 'aws',
    category: 'networking',
    brandColor: '#8B5CF6',
    defaultResourceType: 'aws_vpc',
    defaultSpecs: { count: 1 },
    description: 'Virtual Private Cloud Isolated Network',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#8B5CF6" fill-opacity="0.15" stroke="#8B5CF6" stroke-width="2"/>
      <rect x="16" y="16" width="32" height="32" rx="6" stroke="#8B5CF6" stroke-width="3" stroke-dasharray="4 3"/>
      <path d="M22 26L32 20L42 26V38L32 44L22 38V26Z" stroke="#8B5CF6" stroke-width="2"/>
    </svg>`,
  },
  {
    key: 'aws_api_gateway',
    name: 'AWS API Gateway',
    provider: 'aws',
    category: 'networking',
    brandColor: '#8B5CF6',
    defaultResourceType: 'aws_api_gateway_rest_api',
    defaultSpecs: { count: 1 },
    description: 'API Management & Routing Service',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#8B5CF6" fill-opacity="0.15" stroke="#8B5CF6" stroke-width="2"/>
      <path d="M20 22L14 32L20 42M44 22L50 32L44 42M35 18L29 46" stroke="#8B5CF6" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'aws_nat_gateway',
    name: 'AWS NAT Gateway',
    provider: 'aws',
    category: 'networking',
    brandColor: '#8B5CF6',
    defaultResourceType: 'aws_nat_gateway',
    defaultSpecs: { count: 1 },
    description: 'Outbound Internet Access for Private Subnets',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#8B5CF6" fill-opacity="0.15" stroke="#8B5CF6" stroke-width="2"/>
      <circle cx="32" cy="32" r="14" stroke="#8B5CF6" stroke-width="3"/>
      <path d="M24 32L32 24L40 32M32 24V40" stroke="#8B5CF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'aws_transit_gateway',
    name: 'AWS Transit Gateway',
    provider: 'aws',
    category: 'networking',
    brandColor: '#8B5CF6',
    defaultResourceType: 'aws_ec2_transit_gateway',
    defaultSpecs: { count: 1 },
    description: 'Central Hub to Connect VPCs & On-Premises',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#8B5CF6" fill-opacity="0.15" stroke="#8B5CF6" stroke-width="2"/>
      <circle cx="32" cy="32" r="8" fill="#8B5CF6"/>
      <circle cx="18" cy="18" r="4" fill="#8B5CF6"/>
      <circle cx="46" cy="18" r="4" fill="#8B5CF6"/>
      <circle cx="18" cy="46" r="4" fill="#8B5CF6"/>
      <circle cx="46" cy="46" r="4" fill="#8B5CF6"/>
      <path d="M21 21L27 27M43 21L37 27M21 43L27 37M43 43L37 37" stroke="#8B5CF6" stroke-width="2.5"/>
    </svg>`,
  },
  {
    key: 'aws_ecs',
    name: 'AWS ECS (Container)',
    provider: 'aws',
    category: 'container',
    brandColor: '#FF9900',
    defaultResourceType: 'aws_ecs_cluster',
    defaultSpecs: { count: 2, instanceType: 't3.medium' },
    description: 'Elastic Container Service',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#FF9900" fill-opacity="0.15" stroke="#FF9900" stroke-width="2"/>
      <rect x="18" y="18" width="12" height="12" rx="2" fill="#FF9900"/>
      <rect x="34" y="18" width="12" height="12" rx="2" fill="#FF9900"/>
      <rect x="18" y="34" width="12" height="12" rx="2" fill="#FF9900"/>
      <rect x="34" y="34" width="12" height="12" rx="2" fill="#FF9900"/>
    </svg>`,
  },
  {
    key: 'aws_fargate',
    name: 'AWS Fargate',
    provider: 'aws',
    category: 'container',
    brandColor: '#FF9900',
    defaultResourceType: 'aws_ecs_service',
    defaultSpecs: { count: 2 },
    description: 'Serverless Compute for Containers',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#FF9900" fill-opacity="0.15" stroke="#FF9900" stroke-width="2"/>
      <path d="M32 16L46 24V40L32 48L18 40V24L32 16Z" stroke="#FF9900" stroke-width="3"/>
      <path d="M26 28H38M26 34H38M26 40H34" stroke="#FF9900" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'aws_auto_scaling',
    name: 'AWS Auto Scaling',
    provider: 'aws',
    category: 'compute',
    brandColor: '#FF9900',
    defaultResourceType: 'aws_autoscaling_group',
    defaultSpecs: { minSize: 1, maxSize: 5, desiredCapacity: 2 },
    description: 'Automatic EC2 Capacity Scaling',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#FF9900" fill-opacity="0.15" stroke="#FF9900" stroke-width="2"/>
      <path d="M18 42L28 32L36 38L46 22M46 22H36M46 22V32" stroke="#FF9900" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'aws_ebs',
    name: 'AWS EBS Volume',
    provider: 'aws',
    category: 'storage',
    brandColor: '#3B82F6',
    defaultResourceType: 'aws_ebs_volume',
    defaultSpecs: { storageGb: 100, volumeType: 'gp3' },
    description: 'Elastic Block Store Volume',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#3B82F6" fill-opacity="0.15" stroke="#3B82F6" stroke-width="2"/>
      <rect x="18" y="20" width="28" height="24" rx="4" fill="#3B82F6"/>
      <circle cx="26" cy="32" r="3" fill="white"/>
      <rect x="32" y="30" width="10" height="4" rx="1" fill="white"/>
    </svg>`,
  },
  {
    key: 'aws_efs',
    name: 'AWS EFS File System',
    provider: 'aws',
    category: 'storage',
    brandColor: '#3B82F6',
    defaultResourceType: 'aws_efs_file_system',
    defaultSpecs: { storageGb: 200 },
    description: 'Elastic File System for EC2 & Containers',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#3B82F6" fill-opacity="0.15" stroke="#3B82F6" stroke-width="2"/>
      <path d="M18 20H46V44C46 46.2 44.2 48 42 48H22C19.8 48 18 46.2 18 44V20Z" stroke="#3B82F6" stroke-width="3"/>
      <path d="M24 28H40M24 36H36" stroke="#3B82F6" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'aws_aurora',
    name: 'Amazon Aurora DB',
    provider: 'aws',
    category: 'database',
    brandColor: '#2563EB',
    defaultResourceType: 'aws_rds_cluster',
    defaultSpecs: { instanceType: 'db.r6g.xlarge', count: 2, engine: 'aurora-postgresql' },
    description: 'High Performance Relational DB',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#2563EB" fill-opacity="0.15" stroke="#2563EB" stroke-width="2"/>
      <circle cx="32" cy="32" r="16" stroke="#2563EB" stroke-width="3"/>
      <path d="M22 32C22 26.4772 26.4772 22 32 22C37.5228 22 42 26.4772 42 32" stroke="#2563EB" stroke-width="3"/>
      <circle cx="32" cy="32" r="5" fill="#2563EB"/>
    </svg>`,
  },
  {
    key: 'aws_elasticache',
    name: 'AWS ElastiCache',
    provider: 'aws',
    category: 'database',
    brandColor: '#2563EB',
    defaultResourceType: 'aws_elasticache_cluster',
    defaultSpecs: { nodeType: 'cache.m6g.large', count: 2 },
    description: 'In-Memory Cache (Redis / Memcached)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#2563EB" fill-opacity="0.15" stroke="#2563EB" stroke-width="2"/>
      <path d="M18 22L32 16L46 22L32 28L18 22Z" fill="#2563EB"/>
      <path d="M18 32L32 26L46 32L32 38L18 32Z" fill="#2563EB" fill-opacity="0.7"/>
      <path d="M18 42L32 36L46 42L32 48L18 42Z" fill="#2563EB" fill-opacity="0.4"/>
    </svg>`,
  },
  {
    key: 'aws_redshift',
    name: 'AWS Redshift',
    provider: 'aws',
    category: 'analytics',
    brandColor: '#2563EB',
    defaultResourceType: 'aws_redshift_cluster',
    defaultSpecs: { nodeType: 'ra3.xlplus', count: 2 },
    description: 'Cloud Data Warehouse & Analytics',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#2563EB" fill-opacity="0.15" stroke="#2563EB" stroke-width="2"/>
      <rect x="18" y="18" width="12" height="12" rx="2" fill="#2563EB"/>
      <rect x="34" y="18" width="12" height="12" rx="2" fill="#2563EB"/>
      <rect x="18" y="34" width="28" height="12" rx="2" fill="#2563EB"/>
    </svg>`,
  },
  {
    key: 'aws_sqs',
    name: 'AWS SQS Queue',
    provider: 'aws',
    category: 'integration',
    brandColor: '#EC4899',
    defaultResourceType: 'aws_sqs_queue',
    defaultSpecs: { count: 1 },
    description: 'Message Queuing Service',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <rect x="16" y="22" width="10" height="20" rx="2" fill="#EC4899"/>
      <rect x="29" y="22" width="10" height="20" rx="2" fill="#EC4899"/>
      <rect x="42" y="22" width="10" height="20" rx="2" fill="#EC4899"/>
      <path d="M16 46H48" stroke="#EC4899" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'aws_sns',
    name: 'AWS SNS Notification',
    provider: 'aws',
    category: 'integration',
    brandColor: '#EC4899',
    defaultResourceType: 'aws_sns_topic',
    defaultSpecs: { count: 1 },
    description: 'Pub/Sub Push Notifications Service',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <path d="M32 16C25.3726 16 20 21.3726 20 28V36L16 40V42H48V40L44 36V28C44 21.3726 38.6274 16 32 16Z" fill="#EC4899"/>
      <path d="M28 46C28 48.2091 29.7909 50 32 50C34.2091 50 36 48.2091 36 46" stroke="#EC4899" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'aws_eventbridge',
    name: 'AWS EventBridge',
    provider: 'aws',
    category: 'integration',
    brandColor: '#EC4899',
    defaultResourceType: 'aws_cloudwatch_event_bus',
    defaultSpecs: { count: 1 },
    description: 'Serverless Event Bus Service',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <path d="M20 32H44M36 22L46 32L36 42" stroke="#EC4899" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="20" cy="32" r="4" fill="#EC4899"/>
    </svg>`,
  },
  {
    key: 'aws_kinesis',
    name: 'AWS Kinesis Streams',
    provider: 'aws',
    category: 'integration',
    brandColor: '#EC4899',
    defaultResourceType: 'aws_kinesis_stream',
    defaultSpecs: { shardCount: 2 },
    description: 'Real-time Streaming Data Service',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <path d="M16 28C22 20 28 44 34 24C40 44 46 20 50 34" stroke="#EC4899" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'aws_step_functions',
    name: 'AWS Step Functions',
    provider: 'aws',
    category: 'integration',
    brandColor: '#EC4899',
    defaultResourceType: 'aws_sfn_state_machine',
    defaultSpecs: { count: 1 },
    description: 'Visual Workflow Orchestration',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <rect x="18" y="16" width="28" height="8" rx="2" fill="#EC4899"/>
      <rect x="18" y="28" width="28" height="8" rx="2" fill="#EC4899"/>
      <rect x="18" y="40" width="28" height="8" rx="2" fill="#EC4899"/>
    </svg>`,
  },
  {
    key: 'aws_iam',
    name: 'AWS IAM',
    provider: 'aws',
    category: 'security',
    brandColor: '#10B981',
    defaultResourceType: 'aws_iam_role',
    defaultSpecs: { count: 1 },
    description: 'Identity and Access Management',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
      <circle cx="32" cy="24" r="8" fill="#10B981"/>
      <path d="M20 46C20 38 25 35 32 35C39 35 44 38 44 46" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'aws_kms',
    name: 'AWS KMS Key',
    provider: 'aws',
    category: 'security',
    brandColor: '#10B981',
    defaultResourceType: 'aws_kms_key',
    defaultSpecs: { count: 1 },
    description: 'Key Management Service Encryption',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
      <circle cx="28" cy="28" r="8" stroke="#10B981" stroke-width="3"/>
      <path d="M34 34L46 46M42 42L46 38M38 46L42 42" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'aws_cognito',
    name: 'AWS Cognito',
    provider: 'aws',
    category: 'security',
    brandColor: '#10B981',
    defaultResourceType: 'aws_cognito_user_pool',
    defaultSpecs: { count: 1 },
    description: 'Customer Identity & User Pools Authentication',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
      <circle cx="24" cy="24" r="6" stroke="#10B981" stroke-width="2.5"/>
      <circle cx="40" cy="24" r="6" stroke="#10B981" stroke-width="2.5"/>
      <path d="M16 44C16 38 20 35 25 35M39 35C44 35 48 38 48 44" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'aws_secrets_manager',
    name: 'AWS Secrets Manager',
    provider: 'aws',
    category: 'security',
    brandColor: '#10B981',
    defaultResourceType: 'aws_secretsmanager_secret',
    defaultSpecs: { count: 1 },
    description: 'Encrypt and Rotate Database Credentials',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
      <rect x="20" y="28" width="24" height="18" rx="4" fill="#10B981"/>
      <path d="M26 28V20C26 16.7 28.7 14 32 14C35.3 14 38 16.7 38 20V28" stroke="#10B981" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'aws_waf',
    name: 'AWS WAF',
    provider: 'aws',
    category: 'security',
    brandColor: '#10B981',
    defaultResourceType: 'aws_wafv2_web_acl',
    defaultSpecs: { count: 1 },
    description: 'Web Application Firewall Protection',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
      <path d="M32 16L46 22V32C46 41 39 48 32 52C25 48 18 41 18 32V22L32 16Z" fill="#10B981"/>
    </svg>`,
  },
  {
    key: 'aws_cloudwatch',
    name: 'AWS CloudWatch',
    provider: 'aws',
    category: 'security',
    brandColor: '#0EA5E9',
    defaultResourceType: 'aws_cloudwatch_metric_alarm',
    defaultSpecs: { count: 1 },
    description: 'Observability, Metrics & Logs',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0EA5E9" fill-opacity="0.15" stroke="#0EA5E9" stroke-width="2"/>
      <circle cx="32" cy="32" r="14" stroke="#0EA5E9" stroke-width="3"/>
      <path d="M32 22V32L38 38" stroke="#0EA5E9" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'aws_sagemaker',
    name: 'AWS SageMaker',
    provider: 'aws',
    category: 'ai',
    brandColor: '#EC4899',
    defaultResourceType: 'aws_sagemaker_endpoint',
    defaultSpecs: { instanceType: 'ml.m5.xlarge', count: 1 },
    description: 'Build, Train & Deploy ML Models',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <path d="M32 16L46 24V40L32 48L18 40V24L32 16Z" stroke="#EC4899" stroke-width="3"/>
      <circle cx="32" cy="32" r="6" fill="#EC4899"/>
    </svg>`,
  },
  {
    key: 'aws_athena',
    name: 'AWS Athena',
    provider: 'aws',
    category: 'analytics',
    brandColor: '#2563EB',
    defaultResourceType: 'aws_athena_database',
    defaultSpecs: { count: 1 },
    description: 'Serverless Interactive SQL Queries on S3',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#2563EB" fill-opacity="0.15" stroke="#2563EB" stroke-width="2"/>
      <circle cx="30" cy="30" r="10" stroke="#2563EB" stroke-width="3"/>
      <path d="M38 38L46 46" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },

  // ==========================================
  // Azure (Microsoft) - Brand Color: #0089D6 / #0078D4
  // ==========================================
  {
    key: 'azure_vm',
    name: 'Azure Virtual Machine',
    provider: 'azure',
    category: 'compute',
    brandColor: '#0078D4',
    defaultResourceType: 'azurerm_linux_virtual_machine',
    defaultSpecs: { instanceType: 'Standard_D2s_v3', count: 2, storageGb: 128, region: 'eastus' },
    description: 'Linux/Windows Compute VM',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0078D4" fill-opacity="0.15" stroke="#0078D4" stroke-width="2"/>
      <path d="M18 44L32 18L46 44H36L32 34L28 44H18Z" fill="#0078D4"/>
    </svg>`,
  },
  {
    key: 'azure_aks',
    name: 'Azure AKS (Kubernetes)',
    provider: 'azure',
    category: 'container',
    brandColor: '#0078D4',
    defaultResourceType: 'azurerm_kubernetes_cluster',
    defaultSpecs: { instanceType: 'Standard_DS2_v2', count: 3, region: 'eastus' },
    description: 'Managed Kubernetes Service',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0078D4" fill-opacity="0.15" stroke="#0078D4" stroke-width="2"/>
      <circle cx="32" cy="32" r="16" stroke="#0078D4" stroke-width="3"/>
      <path d="M32 16V48M16 32H48M21 21L43 43M21 43L43 21" stroke="#0078D4" stroke-width="2"/>
    </svg>`,
  },
  {
    key: 'azure_functions',
    name: 'Azure Functions',
    provider: 'azure',
    category: 'compute',
    brandColor: '#0078D4',
    defaultResourceType: 'azurerm_function_app',
    defaultSpecs: { count: 1, region: 'eastus' },
    description: 'Serverless Event-Driven Compute',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0078D4" fill-opacity="0.15" stroke="#0078D4" stroke-width="2"/>
      <path d="M34 16L18 36H30L26 48L44 28H32L34 16Z" fill="#0078D4"/>
    </svg>`,
  },
  {
    key: 'azure_blob',
    name: 'Azure Blob Storage',
    provider: 'azure',
    category: 'storage',
    brandColor: '#0284C7',
    defaultResourceType: 'azurerm_storage_account',
    defaultSpecs: { storageGb: 500, region: 'eastus' },
    description: 'Object Storage for Unstructured Data',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0284C7" fill-opacity="0.15" stroke="#0284C7" stroke-width="2"/>
      <rect x="18" y="20" width="28" height="24" rx="4" stroke="#0284C7" stroke-width="3"/>
      <path d="M24 28H40M24 36H34" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'azure_sql',
    name: 'Azure SQL Database',
    provider: 'azure',
    category: 'database',
    brandColor: '#0284C7',
    defaultResourceType: 'azurerm_mssql_database',
    defaultSpecs: { count: 1, tier: 'General Purpose', storageGb: 250 },
    description: 'Managed Relational SQL Database',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0284C7" fill-opacity="0.15" stroke="#0284C7" stroke-width="2"/>
      <ellipse cx="32" cy="20" rx="14" ry="5" fill="#0284C7"/>
      <path d="M18 20V44C18 46.7 24.3 49 32 49C39.7 49 46 46.7 46 44V20" stroke="#0284C7" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'azure_cosmos',
    name: 'Azure Cosmos DB',
    provider: 'azure',
    category: 'database',
    brandColor: '#0284C7',
    defaultResourceType: 'azurerm_cosmosdb_account',
    defaultSpecs: { count: 1, storageGb: 100 },
    description: 'Globally Distributed NoSQL DB',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0284C7" fill-opacity="0.15" stroke="#0284C7" stroke-width="2"/>
      <circle cx="32" cy="32" r="14" stroke="#0284C7" stroke-width="3"/>
      <ellipse cx="32" cy="32" rx="18" ry="6" stroke="#0284C7" stroke-width="2" transform="rotate(-30 32 32)"/>
    </svg>`,
  },
  {
    key: 'azure_appgw',
    name: 'Azure Application Gateway',
    provider: 'azure',
    category: 'networking',
    brandColor: '#6366F1',
    defaultResourceType: 'azurerm_application_gateway',
    defaultSpecs: { count: 1, isPublic: true },
    description: 'Web Traffic Load Balancer & WAF',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#6366F1" fill-opacity="0.15" stroke="#6366F1" stroke-width="2"/>
      <path d="M16 20H48V44H16V20Z" stroke="#6366F1" stroke-width="3"/>
      <path d="M24 28L32 36L40 28" stroke="#6366F1" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'azure_openai',
    name: 'Azure OpenAI Service',
    provider: 'azure',
    category: 'ai',
    brandColor: '#EC4899',
    defaultResourceType: 'azurerm_cognitive_account',
    defaultSpecs: { count: 1 },
    description: 'Enterprise GPT-4 & AI Models',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <circle cx="32" cy="32" r="12" stroke="#EC4899" stroke-width="3"/>
      <path d="M32 16V20M32 44V48M16 32H20M44 32H48" stroke="#EC4899" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'azure_vnet',
    name: 'Azure Virtual Network (VNet)',
    provider: 'azure',
    category: 'networking',
    brandColor: '#0078D4',
    defaultResourceType: 'azurerm_virtual_network',
    defaultSpecs: { count: 1, region: 'eastus' },
    description: 'Isolated Private Network in Azure',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0078D4" fill-opacity="0.15" stroke="#0078D4" stroke-width="2"/>
      <rect x="16" y="16" width="32" height="32" rx="6" stroke="#0078D4" stroke-width="3" stroke-dasharray="4 3"/>
      <circle cx="24" cy="24" r="4" fill="#0078D4"/>
      <circle cx="40" cy="24" r="4" fill="#0078D4"/>
      <circle cx="32" cy="40" r="4" fill="#0078D4"/>
      <path d="M24 24L32 40L40 24" stroke="#0078D4" stroke-width="2"/>
    </svg>`,
  },
  {
    key: 'azure_load_balancer',
    name: 'Azure Load Balancer',
    provider: 'azure',
    category: 'networking',
    brandColor: '#0078D4',
    defaultResourceType: 'azurerm_lb',
    defaultSpecs: { count: 1, isPublic: true },
    description: 'High Performance Layer-4 Load Balancer',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0078D4" fill-opacity="0.15" stroke="#0078D4" stroke-width="2"/>
      <path d="M18 32H46M32 18V46M24 24L32 18L40 24M24 40L32 46L40 40" stroke="#0078D4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'azure_front_door',
    name: 'Azure Front Door & CDN',
    provider: 'azure',
    category: 'networking',
    brandColor: '#0078D4',
    defaultResourceType: 'azurerm_cdn_frontdoor_profile',
    defaultSpecs: { count: 1 },
    description: 'Global Web CDN & Edge Security',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0078D4" fill-opacity="0.15" stroke="#0078D4" stroke-width="2"/>
      <circle cx="32" cy="32" r="14" stroke="#0078D4" stroke-width="3"/>
      <path d="M18 32H46M32 18C36 22 38 27 38 32C38 37 36 42 32 46C28 42 26 37 26 32C26 27 28 22 32 18Z" stroke="#0078D4" stroke-width="2"/>
    </svg>`,
  },
  {
    key: 'azure_expressroute',
    name: 'Azure ExpressRoute',
    provider: 'azure',
    category: 'networking',
    brandColor: '#0078D4',
    defaultResourceType: 'azurerm_express_route_circuit',
    defaultSpecs: { count: 1 },
    description: 'Dedicated Private Connection to Azure',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0078D4" fill-opacity="0.15" stroke="#0078D4" stroke-width="2"/>
      <path d="M16 26H48M16 38H48M26 18L18 26L26 34M38 30L46 38L38 46" stroke="#0078D4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'azure_firewall',
    name: 'Azure Firewall',
    provider: 'azure',
    category: 'security',
    brandColor: '#10B981',
    defaultResourceType: 'azurerm_firewall',
    defaultSpecs: { count: 1 },
    description: 'Cloud-native Network Security Appliance',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
      <rect x="18" y="18" width="28" height="28" rx="4" stroke="#10B981" stroke-width="3"/>
      <path d="M18 27H46M18 36H46M32 18V27M25 27V36M39 27V36M32 36V46" stroke="#10B981" stroke-width="2.5"/>
    </svg>`,
  },
  {
    key: 'azure_app_service',
    name: 'Azure App Service',
    provider: 'azure',
    category: 'compute',
    brandColor: '#0078D4',
    defaultResourceType: 'azurerm_service_plan',
    defaultSpecs: { instanceType: 'P1v2', count: 1 },
    description: 'Fully Managed Web App Platform',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0078D4" fill-opacity="0.15" stroke="#0078D4" stroke-width="2"/>
      <path d="M22 20H42C44.2 20 46 21.8 46 24V40C46 42.2 44.2 44 42 44H22C19.8 44 18 42.2 18 40V24C18 21.8 19.8 20 22 20Z" stroke="#0078D4" stroke-width="3"/>
      <path d="M24 28L30 32L24 36M34 36H40" stroke="#0078D4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'azure_container_apps',
    name: 'Azure Container Apps',
    provider: 'azure',
    category: 'container',
    brandColor: '#0078D4',
    defaultResourceType: 'azurerm_container_app',
    defaultSpecs: { count: 2 },
    description: 'Serverless Microservices & Containers',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0078D4" fill-opacity="0.15" stroke="#0078D4" stroke-width="2"/>
      <rect x="18" y="22" width="12" height="12" rx="2" fill="#0078D4"/>
      <rect x="34" y="22" width="12" height="12" rx="2" fill="#0078D4"/>
      <rect x="26" y="38" width="12" height="12" rx="2" fill="#0078D4"/>
    </svg>`,
  },
  {
    key: 'azure_logic_apps',
    name: 'Azure Logic Apps',
    provider: 'azure',
    category: 'integration',
    brandColor: '#EC4899',
    defaultResourceType: 'azurerm_logic_app_workflow',
    defaultSpecs: { count: 1 },
    description: 'Automated Workflows & Integration',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <circle cx="22" cy="22" r="5" fill="#EC4899"/>
      <circle cx="42" cy="22" r="5" fill="#EC4899"/>
      <circle cx="32" cy="42" r="5" fill="#EC4899"/>
      <path d="M26 24L37 38M38 24L27 38" stroke="#EC4899" stroke-width="2.5"/>
    </svg>`,
  },
  {
    key: 'azure_redis',
    name: 'Azure Cache for Redis',
    provider: 'azure',
    category: 'database',
    brandColor: '#0284C7',
    defaultResourceType: 'azurerm_redis_cache',
    defaultSpecs: { count: 1, storageGb: 13 },
    description: 'In-Memory Caching & Data Store',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0284C7" fill-opacity="0.15" stroke="#0284C7" stroke-width="2"/>
      <path d="M18 24L32 18L46 24L32 30L18 24Z" fill="#0284C7"/>
      <path d="M18 34L32 28L46 34L32 40L18 34Z" fill="#0284C7" fill-opacity="0.7"/>
      <path d="M18 44L32 38L46 44L32 50L18 44Z" fill="#0284C7" fill-opacity="0.4"/>
    </svg>`,
  },
  {
    key: 'azure_postgres',
    name: 'Azure DB for PostgreSQL',
    provider: 'azure',
    category: 'database',
    brandColor: '#0284C7',
    defaultResourceType: 'azurerm_postgresql_flexible_server',
    defaultSpecs: { instanceType: 'Standard_D2s_v3', count: 1, storageGb: 128 },
    description: 'Managed Flexible PostgreSQL Database',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0284C7" fill-opacity="0.15" stroke="#0284C7" stroke-width="2"/>
      <path d="M32 18C23 18 18 24 18 32C18 40 24 46 32 46C38 46 44 41 45 35M32 26V38M26 32H38" stroke="#0284C7" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'azure_service_bus',
    name: 'Azure Service Bus',
    provider: 'azure',
    category: 'integration',
    brandColor: '#EC4899',
    defaultResourceType: 'azurerm_servicebus_namespace',
    defaultSpecs: { count: 1 },
    description: 'Enterprise Messaging & Queues',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <rect x="16" y="24" width="32" height="16" rx="4" fill="#EC4899"/>
      <circle cx="24" cy="32" r="3" fill="white"/>
      <circle cx="32" cy="32" r="3" fill="white"/>
      <circle cx="40" cy="32" r="3" fill="white"/>
    </svg>`,
  },
  {
    key: 'azure_event_grid',
    name: 'Azure Event Grid',
    provider: 'azure',
    category: 'integration',
    brandColor: '#EC4899',
    defaultResourceType: 'azurerm_eventgrid_topic',
    defaultSpecs: { count: 1 },
    description: 'Serverless Event Delivery at Scale',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <path d="M20 20L44 44M44 20L20 44M32 16V48M16 32H48" stroke="#EC4899" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'azure_event_hubs',
    name: 'Azure Event Hubs',
    provider: 'azure',
    category: 'integration',
    brandColor: '#EC4899',
    defaultResourceType: 'azurerm_eventhub_namespace',
    defaultSpecs: { count: 1 },
    description: 'Big Data Streaming Platform',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <circle cx="32" cy="32" r="14" stroke="#EC4899" stroke-width="3"/>
      <path d="M22 32H42M32 22V42" stroke="#EC4899" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'azure_key_vault',
    name: 'Azure Key Vault',
    provider: 'azure',
    category: 'security',
    brandColor: '#10B981',
    defaultResourceType: 'azurerm_key_vault',
    defaultSpecs: { count: 1 },
    description: 'Secrets, Keys & Certificate Management',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
      <path d="M32 16L44 22V30C44 38 38 45 32 48C26 45 20 38 20 30V22L32 16Z" fill="#10B981"/>
      <circle cx="32" cy="30" r="3" fill="white"/>
      <path d="M32 33V39" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'azure_entra_id',
    name: 'Microsoft Entra ID (Azure AD)',
    provider: 'azure',
    category: 'security',
    brandColor: '#10B981',
    defaultResourceType: 'azuread_user',
    defaultSpecs: { count: 1 },
    description: 'Cloud Identity & Access Management',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
      <circle cx="32" cy="24" r="8" fill="#10B981"/>
      <path d="M20 46C20 38 25 35 32 35C39 35 44 38 44 46" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'azure_monitor',
    name: 'Azure Monitor / App Insights',
    provider: 'azure',
    category: 'security',
    brandColor: '#0EA5E9',
    defaultResourceType: 'azurerm_application_insights',
    defaultSpecs: { count: 1 },
    description: 'Application Performance Monitoring & Logs',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0EA5E9" fill-opacity="0.15" stroke="#0EA5E9" stroke-width="2"/>
      <path d="M18 42L28 30L36 36L46 20" stroke="#0EA5E9" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="46" cy="20" r="3" fill="#0EA5E9"/>
    </svg>`,
  },
  {
    key: 'azure_synapse',
    name: 'Azure Synapse Analytics',
    provider: 'azure',
    category: 'analytics',
    brandColor: '#0284C7',
    defaultResourceType: 'azurerm_synapse_workspace',
    defaultSpecs: { count: 1 },
    description: 'Unified Data Integration & Enterprise Warehouse',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0284C7" fill-opacity="0.15" stroke="#0284C7" stroke-width="2"/>
      <circle cx="32" cy="22" r="6" fill="#0284C7"/>
      <circle cx="20" cy="42" r="6" fill="#0284C7"/>
      <circle cx="44" cy="42" r="6" fill="#0284C7"/>
      <path d="M29 27L23 37M35 27L41 37M26 42H38" stroke="#0284C7" stroke-width="2.5"/>
    </svg>`,
  },
  {
    key: 'azure_databricks',
    name: 'Azure Databricks',
    provider: 'azure',
    category: 'analytics',
    brandColor: '#FF3621',
    defaultResourceType: 'azurerm_databricks_workspace',
    defaultSpecs: { count: 1 },
    description: 'Spark-based Data Engineering & AI Platform',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#FF3621" fill-opacity="0.15" stroke="#FF3621" stroke-width="2"/>
      <path d="M32 16L48 24L32 32L16 24L32 16Z" fill="#FF3621"/>
      <path d="M32 32L48 40L32 48L16 40L32 32Z" fill="#FF3621" fill-opacity="0.7"/>
    </svg>`,
  },

  // ==========================================
  // GCP (Google Cloud Platform) - Brand Color: #4285F4 / #EA4335
  // ==========================================
  {
    key: 'gcp_gce',
    name: 'GCP Compute Engine',
    provider: 'gcp',
    category: 'compute',
    brandColor: '#4285F4',
    defaultResourceType: 'google_compute_instance',
    defaultSpecs: { instanceType: 'e2-standard-2', count: 2, storageGb: 100, region: 'us-central1' },
    description: 'Virtual Machine Instances',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <rect x="18" y="18" width="28" height="28" rx="4" fill="#4285F4"/>
      <path d="M26 26H38M26 32H38M26 38H34" stroke="white" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'gcp_cloud_run',
    name: 'GCP Cloud Run',
    provider: 'gcp',
    category: 'compute',
    brandColor: '#4285F4',
    defaultResourceType: 'google_cloud_run_v2_service',
    defaultSpecs: { count: 1, region: 'us-central1' },
    description: 'Managed Serverless Container Platform',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <path d="M20 42L28 22H44L36 42H20Z" fill="#4285F4"/>
      <circle cx="42" cy="22" r="4" fill="#34A853"/>
    </svg>`,
  },
  {
    key: 'gcp_gke',
    name: 'GCP GKE (Kubernetes)',
    provider: 'gcp',
    category: 'container',
    brandColor: '#4285F4',
    defaultResourceType: 'google_container_cluster',
    defaultSpecs: { instanceType: 'e2-standard-4', count: 3, region: 'us-central1' },
    description: 'Google Kubernetes Engine',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <path d="M32 16L46 24V40L32 48L18 40V24L32 16Z" fill="#4285F4"/>
      <path d="M32 24L40 28V36L32 40L24 36V28L32 24Z" fill="white"/>
    </svg>`,
  },
  {
    key: 'gcp_gcs',
    name: 'GCP Cloud Storage',
    provider: 'gcp',
    category: 'storage',
    brandColor: '#34A853',
    defaultResourceType: 'google_storage_bucket',
    defaultSpecs: { storageGb: 500, region: 'us-central1' },
    description: 'Unified Object Storage',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#34A853" fill-opacity="0.15" stroke="#34A853" stroke-width="2"/>
      <path d="M20 24C20 20.6863 25.3726 18 32 18C38.6274 18 44 20.6863 44 24M20 24V40C20 43.3137 25.3726 46 32 46C38.6274 46 44 43.3137 44 40V24M20 24C20 27.3137 25.3726 30 32 30C38.6274 30 44 27.3137 44 24" stroke="#34A853" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'gcp_cloud_sql',
    name: 'GCP Cloud SQL',
    provider: 'gcp',
    category: 'database',
    brandColor: '#EA4335',
    defaultResourceType: 'google_sql_database_instance',
    defaultSpecs: { instanceType: 'db-custom-2-7680', count: 1, storageGb: 100, engine: 'POSTGRES_15' },
    description: 'Managed PostgreSQL & MySQL',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EA4335" fill-opacity="0.15" stroke="#EA4335" stroke-width="2"/>
      <ellipse cx="32" cy="20" rx="14" ry="5" fill="#EA4335"/>
      <path d="M18 20V44C18 46.7 24.3 49 32 49C39.7 49 46 46.7 46 44V20" stroke="#EA4335" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'gcp_bigquery',
    name: 'GCP BigQuery',
    provider: 'gcp',
    category: 'analytics',
    brandColor: '#4285F4',
    defaultResourceType: 'google_bigquery_dataset',
    defaultSpecs: { storageGb: 1000 },
    description: 'Serverless Data Warehouse',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <rect x="18" y="18" width="12" height="12" fill="#4285F4"/>
      <rect x="34" y="18" width="12" height="12" fill="#34A853"/>
      <rect x="18" y="34" width="12" height="12" fill="#FBBC04"/>
      <rect x="34" y="34" width="12" height="12" fill="#EA4335"/>
    </svg>`,
  },
  {
    key: 'gcp_vertex_ai',
    name: 'GCP Vertex AI',
    provider: 'gcp',
    category: 'ai',
    brandColor: '#EA4335',
    defaultResourceType: 'google_vertex_ai_endpoint',
    defaultSpecs: { count: 1 },
    description: 'Unified AI/ML Platform',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EA4335" fill-opacity="0.15" stroke="#EA4335" stroke-width="2"/>
      <path d="M32 16L44 38H20L32 16Z" fill="#EA4335"/>
      <circle cx="32" cy="30" r="4" fill="white"/>
    </svg>`,
  },
  {
    key: 'gcp_vpc',
    name: 'GCP VPC Network',
    provider: 'gcp',
    category: 'networking',
    brandColor: '#4285F4',
    defaultResourceType: 'google_compute_network',
    defaultSpecs: { count: 1, region: 'us-central1' },
    description: 'Virtual Private Cloud Isolated Network',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <rect x="16" y="16" width="32" height="32" rx="6" stroke="#4285F4" stroke-width="3" stroke-dasharray="4 3"/>
      <circle cx="24" cy="24" r="4" fill="#4285F4"/>
      <circle cx="40" cy="24" r="4" fill="#4285F4"/>
      <circle cx="32" cy="40" r="4" fill="#34A853"/>
      <path d="M24 24L32 40L40 24" stroke="#4285F4" stroke-width="2"/>
    </svg>`,
  },
  {
    key: 'gcp_cloud_load_balancing',
    name: 'GCP Cloud Load Balancing',
    provider: 'gcp',
    category: 'networking',
    brandColor: '#4285F4',
    defaultResourceType: 'google_compute_global_forwarding_rule',
    defaultSpecs: { count: 1, isPublic: true },
    description: 'Global HTTP(S) & Layer 4 Load Balancing',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <path d="M18 32H46M32 18V46M24 24L32 18L40 24M24 40L32 46L40 40" stroke="#4285F4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'gcp_cloud_cdn',
    name: 'GCP Cloud CDN',
    provider: 'gcp',
    category: 'networking',
    brandColor: '#4285F4',
    defaultResourceType: 'google_compute_backend_service',
    defaultSpecs: { count: 1 },
    description: 'Fast, Global Content Delivery Network',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <circle cx="32" cy="32" r="14" stroke="#4285F4" stroke-width="3"/>
      <path d="M18 32H46M32 18C36 22 38 27 38 32C38 37 36 42 32 46C28 42 26 37 26 32C26 27 28 22 32 18Z" stroke="#34A853" stroke-width="2"/>
    </svg>`,
  },
  {
    key: 'gcp_cloud_dns',
    name: 'GCP Cloud DNS',
    provider: 'gcp',
    category: 'networking',
    brandColor: '#4285F4',
    defaultResourceType: 'google_dns_managed_zone',
    defaultSpecs: { count: 1 },
    description: 'Reliable, Low-Latency Managed DNS',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <circle cx="32" cy="32" r="14" stroke="#4285F4" stroke-width="3"/>
      <path d="M26 26L38 38M38 26L26 38" stroke="#FBBC04" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'gcp_cloud_armor',
    name: 'GCP Cloud Armor',
    provider: 'gcp',
    category: 'security',
    brandColor: '#34A853',
    defaultResourceType: 'google_compute_security_policy',
    defaultSpecs: { count: 1 },
    description: 'DDoS Protection & Web Application Firewall',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#34A853" fill-opacity="0.15" stroke="#34A853" stroke-width="2"/>
      <path d="M32 16L46 22V32C46 41 39 48 32 52C25 48 18 41 18 32V22L32 16Z" fill="#34A853"/>
    </svg>`,
  },
  {
    key: 'gcp_cloud_functions',
    name: 'GCP Cloud Functions',
    provider: 'gcp',
    category: 'compute',
    brandColor: '#4285F4',
    defaultResourceType: 'google_cloudfunctions_function',
    defaultSpecs: { count: 1 },
    description: 'Serverless Event-Driven Functions',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <path d="M36 16L20 36H32L28 48L44 28H32L36 16Z" fill="#FBBC04"/>
    </svg>`,
  },
  {
    key: 'gcp_app_engine',
    name: 'GCP App Engine',
    provider: 'gcp',
    category: 'compute',
    brandColor: '#4285F4',
    defaultResourceType: 'google_app_engine_application',
    defaultSpecs: { count: 1 },
    description: 'Serverless App Development Platform',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <path d="M32 16L46 42H18L32 16Z" fill="#4285F4"/>
      <path d="M28 32H36" stroke="white" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'gcp_cloud_spanner',
    name: 'GCP Cloud Spanner',
    provider: 'gcp',
    category: 'database',
    brandColor: '#EA4335',
    defaultResourceType: 'google_spanner_instance',
    defaultSpecs: { count: 1, storageGb: 500 },
    description: 'Globally Distributed Relational DB with Unlimited Scale',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EA4335" fill-opacity="0.15" stroke="#EA4335" stroke-width="2"/>
      <circle cx="32" cy="32" r="14" stroke="#EA4335" stroke-width="3"/>
      <path d="M18 32H46M32 18V46" stroke="#EA4335" stroke-width="2"/>
    </svg>`,
  },
  {
    key: 'gcp_cloud_bigtable',
    name: 'GCP Cloud Bigtable',
    provider: 'gcp',
    category: 'database',
    brandColor: '#EA4335',
    defaultResourceType: 'google_bigtable_instance',
    defaultSpecs: { count: 1, nodeType: 'SSD' },
    description: 'Enterprise NoSQL Wide-Column DB',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EA4335" fill-opacity="0.15" stroke="#EA4335" stroke-width="2"/>
      <rect x="18" y="18" width="28" height="8" rx="2" fill="#EA4335"/>
      <rect x="18" y="28" width="28" height="8" rx="2" fill="#EA4335"/>
      <rect x="18" y="38" width="28" height="8" rx="2" fill="#EA4335"/>
    </svg>`,
  },
  {
    key: 'gcp_firestore',
    name: 'GCP Cloud Firestore',
    provider: 'gcp',
    category: 'database',
    brandColor: '#EA4335',
    defaultResourceType: 'google_firestore_database',
    defaultSpecs: { count: 1, storageGb: 50 },
    description: 'Serverless Document NoSQL Database',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EA4335" fill-opacity="0.15" stroke="#EA4335" stroke-width="2"/>
      <path d="M22 20H42C44 20 46 22 46 24V40C46 42 44 44 42 44H22C20 44 18 42 18 40V24C18 22 20 20 22 20Z" stroke="#EA4335" stroke-width="3"/>
      <path d="M26 28H38M26 34H34" stroke="#FBBC04" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'gcp_memorystore',
    name: 'GCP Memorystore (Redis)',
    provider: 'gcp',
    category: 'database',
    brandColor: '#EA4335',
    defaultResourceType: 'google_redis_instance',
    defaultSpecs: { count: 1, storageGb: 10 },
    description: 'Fully Managed In-Memory Redis Store',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EA4335" fill-opacity="0.15" stroke="#EA4335" stroke-width="2"/>
      <path d="M18 24L32 18L46 24L32 30L18 24Z" fill="#EA4335"/>
      <path d="M18 34L32 28L46 34L32 40L18 34Z" fill="#EA4335" fill-opacity="0.7"/>
      <path d="M18 44L32 38L46 44L32 50L18 44Z" fill="#EA4335" fill-opacity="0.4"/>
    </svg>`,
  },
  {
    key: 'gcp_pubsub',
    name: 'GCP Cloud Pub/Sub',
    provider: 'gcp',
    category: 'integration',
    brandColor: '#4285F4',
    defaultResourceType: 'google_pubsub_topic',
    defaultSpecs: { count: 1 },
    description: 'Global Ingestion & Event Messaging',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <circle cx="20" cy="32" r="5" fill="#4285F4"/>
      <circle cx="44" cy="20" r="5" fill="#34A853"/>
      <circle cx="44" cy="44" r="5" fill="#FBBC04"/>
      <path d="M25 32H34M34 32V20H39M34 32V44H39" stroke="#4285F4" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'gcp_dataflow',
    name: 'GCP Cloud Dataflow',
    provider: 'gcp',
    category: 'analytics',
    brandColor: '#4285F4',
    defaultResourceType: 'google_dataflow_job',
    defaultSpecs: { count: 1 },
    description: 'Stream & Batch Unified Data Processing (Beam)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <path d="M16 28C22 20 28 44 34 24C40 44 46 20 50 34" stroke="#4285F4" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'gcp_dataproc',
    name: 'GCP Cloud Dataproc',
    provider: 'gcp',
    category: 'analytics',
    brandColor: '#4285F4',
    defaultResourceType: 'google_dataproc_cluster',
    defaultSpecs: { count: 1 },
    description: 'Managed Apache Spark & Hadoop Service',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <circle cx="32" cy="22" r="6" fill="#4285F4"/>
      <circle cx="20" cy="42" r="6" fill="#34A853"/>
      <circle cx="44" cy="42" r="6" fill="#EA4335"/>
      <path d="M29 27L23 37M35 27L41 37M26 42H38" stroke="#4285F4" stroke-width="2.5"/>
    </svg>`,
  },
  {
    key: 'gcp_iam',
    name: 'GCP Identity & Access (IAM)',
    provider: 'gcp',
    category: 'security',
    brandColor: '#34A853',
    defaultResourceType: 'google_project_iam_member',
    defaultSpecs: { count: 1 },
    description: 'Fine-grained Access Control & Permissions',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#34A853" fill-opacity="0.15" stroke="#34A853" stroke-width="2"/>
      <circle cx="32" cy="24" r="8" fill="#34A853"/>
      <path d="M20 46C20 38 25 35 32 35C39 35 44 38 44 46" stroke="#34A853" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'gcp_secret_manager',
    name: 'GCP Secret Manager',
    provider: 'gcp',
    category: 'security',
    brandColor: '#34A853',
    defaultResourceType: 'google_secret_manager_secret',
    defaultSpecs: { count: 1 },
    description: 'Central Secret Storage & Versioning',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#34A853" fill-opacity="0.15" stroke="#34A853" stroke-width="2"/>
      <rect x="20" y="28" width="24" height="18" rx="4" fill="#34A853"/>
      <path d="M26 28V20C26 16.7 28.7 14 32 14C35.3 14 38 16.7 38 20V28" stroke="#34A853" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'gcp_cloud_monitoring',
    name: 'GCP Cloud Monitoring',
    provider: 'gcp',
    category: 'security',
    brandColor: '#4285F4',
    defaultResourceType: 'google_monitoring_alert_policy',
    defaultSpecs: { count: 1 },
    description: 'Cloud Operations, Logs, Metrics & Tracing',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4285F4" fill-opacity="0.15" stroke="#4285F4" stroke-width="2"/>
      <path d="M18 42L28 30L36 36L46 20" stroke="#4285F4" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="46" cy="20" r="3" fill="#EA4335"/>
    </svg>`,
  },

  // ==========================================
  // OCI (Oracle Cloud Infrastructure) - Brand Color: #F80000 / #312D2A
  // ==========================================
  {
    key: 'oci_compute',
    name: 'OCI Compute Instance',
    provider: 'oci',
    category: 'compute',
    brandColor: '#F80000',
    defaultResourceType: 'oci_core_instance',
    defaultSpecs: { instanceType: 'VM.Standard2.1', count: 2, storageGb: 50, region: 'us-ashburn-1' },
    description: 'Oracle Compute bare metal & VM',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F80000" fill-opacity="0.15" stroke="#F80000" stroke-width="2"/>
      <path d="M16 22H48V42H16V22Z" fill="#F80000"/>
      <circle cx="24" cy="32" r="3" fill="white"/>
      <circle cx="32" cy="32" r="3" fill="white"/>
      <circle cx="40" cy="32" r="3" fill="white"/>
    </svg>`,
  },
  {
    key: 'oci_oke',
    name: 'OCI OKE (Kubernetes)',
    provider: 'oci',
    category: 'container',
    brandColor: '#F80000',
    defaultResourceType: 'oci_containerengine_cluster',
    defaultSpecs: { instanceType: 'VM.Standard.E4.Flex', count: 3, region: 'us-ashburn-1' },
    description: 'Oracle Kubernetes Engine',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F80000" fill-opacity="0.15" stroke="#F80000" stroke-width="2"/>
      <path d="M32 16L46 24V40L32 48L18 40V24L32 16Z" fill="#F80000"/>
      <path d="M32 26L38 30V36L32 39L26 36V30L32 26Z" stroke="white" stroke-width="2"/>
    </svg>`,
  },
  {
    key: 'oci_autonomous_db',
    name: 'OCI Autonomous Database',
    provider: 'oci',
    category: 'database',
    brandColor: '#F80000',
    defaultResourceType: 'oci_database_autonomous_database',
    defaultSpecs: { count: 1, storageGb: 1000, engine: 'OLTP' },
    description: 'Self-driving Oracle SQL Database',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F80000" fill-opacity="0.15" stroke="#F80000" stroke-width="2"/>
      <ellipse cx="32" cy="20" rx="14" ry="5" fill="#F80000"/>
      <path d="M18 20V44C18 46.7 24.3 49 32 49C39.7 49 46 46.7 46 44V20" stroke="#F80000" stroke-width="3"/>
      <path d="M26 32L38 32" stroke="white" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'oci_object_storage',
    name: 'OCI Object Storage',
    provider: 'oci',
    category: 'storage',
    brandColor: '#F80000',
    defaultResourceType: 'oci_objectstorage_bucket',
    defaultSpecs: { storageGb: 500, region: 'us-ashburn-1' },
    description: 'High-performance Object Storage',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F80000" fill-opacity="0.15" stroke="#F80000" stroke-width="2"/>
      <rect x="18" y="22" width="28" height="20" rx="4" stroke="#F80000" stroke-width="3"/>
      <path d="M24 32H40" stroke="#F80000" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'oci_vcn',
    name: 'OCI VCN (Virtual Cloud Network)',
    provider: 'oci',
    category: 'networking',
    brandColor: '#D97706',
    defaultResourceType: 'oci_core_vcn',
    defaultSpecs: { count: 1 },
    description: 'Software-Defined Network for OCI',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#D97706" fill-opacity="0.15" stroke="#D97706" stroke-width="2"/>
      <rect x="16" y="16" width="32" height="32" rx="4" stroke="#D97706" stroke-width="3" stroke-dasharray="4 4"/>
      <circle cx="32" cy="32" r="8" fill="#D97706"/>
    </svg>`,
  },
  {
    key: 'oci_load_balancer',
    name: 'OCI Load Balancer',
    provider: 'oci',
    category: 'networking',
    brandColor: '#D97706',
    defaultResourceType: 'oci_load_balancer_load_balancer',
    defaultSpecs: { count: 1, isPublic: true },
    description: 'Layer 4/7 Automated Load Balancer',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#D97706" fill-opacity="0.15" stroke="#D97706" stroke-width="2"/>
      <circle cx="20" cy="32" r="5" fill="#D97706"/>
      <circle cx="44" cy="20" r="5" fill="#D97706"/>
      <circle cx="44" cy="44" r="5" fill="#D97706"/>
      <path d="M25 32H34M34 32V20H39M34 32V44H39" stroke="#D97706" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'oci_vault',
    name: 'OCI Vault & Key Management',
    provider: 'oci',
    category: 'security',
    brandColor: '#10B981',
    defaultResourceType: 'oci_kms_vault',
    defaultSpecs: { count: 1 },
    description: 'Encryption Keys & Secrets Management',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
      <rect x="20" y="26" width="24" height="20" rx="4" stroke="#10B981" stroke-width="3"/>
      <path d="M26 26V20C26 16.7 28.7 14 32 14C35.3 14 38 16.7 38 20V26" stroke="#10B981" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'oci_drg',
    name: 'OCI Dynamic Routing Gateway (DRG)',
    provider: 'oci',
    category: 'networking',
    brandColor: '#D97706',
    defaultResourceType: 'oci_core_drg',
    defaultSpecs: { count: 1 },
    description: 'Virtual Router connecting VCNs, FastConnect & IPSec VPN',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#D97706" fill-opacity="0.15" stroke="#D97706" stroke-width="2"/>
      <circle cx="32" cy="32" r="14" stroke="#D97706" stroke-width="3"/>
      <path d="M22 32L42 32M32 22L32 42M26 26L38 38M38 26L26 38" stroke="#D97706" stroke-width="2"/>
    </svg>`,
  },
  {
    key: 'oci_fastconnect',
    name: 'OCI FastConnect',
    provider: 'oci',
    category: 'networking',
    brandColor: '#D97706',
    defaultResourceType: 'oci_core_fast_connect_provider_service',
    defaultSpecs: { count: 1 },
    description: 'Dedicated Private Connection to OCI',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#D97706" fill-opacity="0.15" stroke="#D97706" stroke-width="2"/>
      <path d="M16 26H48M16 38H48M26 18L18 26L26 34M38 30L46 38L38 46" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'oci_service_gateway',
    name: 'OCI Service Gateway',
    provider: 'oci',
    category: 'networking',
    brandColor: '#D97706',
    defaultResourceType: 'oci_core_service_gateway',
    defaultSpecs: { count: 1 },
    description: 'Private access to OCI Public Services (Storage, Autonomous DB)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#D97706" fill-opacity="0.15" stroke="#D97706" stroke-width="2"/>
      <path d="M18 32C18 24 24 18 32 18C40 18 46 24 46 32" stroke="#D97706" stroke-width="3"/>
      <path d="M24 38L32 46L40 38" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'oci_nat_gateway',
    name: 'OCI NAT Gateway',
    provider: 'oci',
    category: 'networking',
    brandColor: '#D97706',
    defaultResourceType: 'oci_core_nat_gateway',
    defaultSpecs: { count: 1 },
    description: 'Outbound Internet Access for Private Subnets',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#D97706" fill-opacity="0.15" stroke="#D97706" stroke-width="2"/>
      <circle cx="32" cy="32" r="14" stroke="#D97706" stroke-width="3"/>
      <path d="M24 32L32 24L40 32M32 24V40" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'oci_api_gateway',
    name: 'OCI API Gateway',
    provider: 'oci',
    category: 'networking',
    brandColor: '#D97706',
    defaultResourceType: 'oci_apigateway_gateway',
    defaultSpecs: { count: 1 },
    description: 'API Management & Routing Gateway',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#D97706" fill-opacity="0.15" stroke="#D97706" stroke-width="2"/>
      <path d="M20 24L14 32L20 40M44 24L50 32L44 40M35 18L29 46" stroke="#D97706" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'oci_functions',
    name: 'OCI Functions',
    provider: 'oci',
    category: 'compute',
    brandColor: '#F80000',
    defaultResourceType: 'oci_functions_function',
    defaultSpecs: { count: 1 },
    description: 'Serverless Event-Driven Functions (Fn Project)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F80000" fill-opacity="0.15" stroke="#F80000" stroke-width="2"/>
      <path d="M36 16L20 36H32L28 48L44 28H32L36 16Z" fill="#F80000"/>
    </svg>`,
  },
  {
    key: 'oci_exadata',
    name: 'OCI Exadata Database Service',
    provider: 'oci',
    category: 'database',
    brandColor: '#F80000',
    defaultResourceType: 'oci_database_exadata_infrastructure',
    defaultSpecs: { count: 1, storageGb: 2000 },
    description: 'Extreme Performance Enterprise Oracle DB Infrastructure',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F80000" fill-opacity="0.15" stroke="#F80000" stroke-width="2"/>
      <rect x="18" y="16" width="28" height="8" rx="2" fill="#F80000"/>
      <rect x="18" y="28" width="28" height="8" rx="2" fill="#F80000"/>
      <rect x="18" y="40" width="28" height="8" rx="2" fill="#F80000"/>
      <circle cx="22" cy="20" r="1.5" fill="white"/>
      <circle cx="22" cy="32" r="1.5" fill="white"/>
      <circle cx="22" cy="44" r="1.5" fill="white"/>
    </svg>`,
  },
  {
    key: 'oci_mysql_heatwave',
    name: 'OCI MySQL HeatWave',
    provider: 'oci',
    category: 'database',
    brandColor: '#F80000',
    defaultResourceType: 'oci_mysql_mysql_db_system',
    defaultSpecs: { count: 1, storageGb: 200 },
    description: 'OLTP & Real-time OLAP Analytics In-Memory MySQL',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F80000" fill-opacity="0.15" stroke="#F80000" stroke-width="2"/>
      <ellipse cx="32" cy="22" rx="14" ry="5" fill="#F80000"/>
      <path d="M18 22V42C18 44.7 24.3 47 32 47C39.7 47 46 44.7 46 42V22" stroke="#F80000" stroke-width="3"/>
      <path d="M22 30L42 30" stroke="#F80000" stroke-width="2"/>
    </svg>`,
  },
  {
    key: 'oci_nosql',
    name: 'OCI NoSQL Database',
    provider: 'oci',
    category: 'database',
    brandColor: '#F80000',
    defaultResourceType: 'oci_nosql_table',
    defaultSpecs: { count: 1, storageGb: 50 },
    description: 'Fully Managed Predictable Single-Digit Ms NoSQL DB',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F80000" fill-opacity="0.15" stroke="#F80000" stroke-width="2"/>
      <path d="M32 16L48 24V40L32 48L16 40V24L32 16Z" stroke="#F80000" stroke-width="3" fill="#F80000" fill-opacity="0.2"/>
      <path d="M32 24L40 28V36L32 40L24 36V28L32 24Z" fill="#F80000"/>
    </svg>`,
  },
  {
    key: 'oci_block_volume',
    name: 'OCI Block Volume',
    provider: 'oci',
    category: 'storage',
    brandColor: '#F80000',
    defaultResourceType: 'oci_core_volume',
    defaultSpecs: { storageGb: 100 },
    description: 'High-Performance Persistent Block Storage for Compute',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F80000" fill-opacity="0.15" stroke="#F80000" stroke-width="2"/>
      <rect x="18" y="20" width="28" height="24" rx="4" fill="#F80000"/>
      <circle cx="26" cy="32" r="3" fill="white"/>
      <rect x="32" y="30" width="10" height="4" rx="1" fill="white"/>
    </svg>`,
  },
  {
    key: 'oci_file_storage',
    name: 'OCI File Storage (FSS)',
    provider: 'oci',
    category: 'storage',
    brandColor: '#F80000',
    defaultResourceType: 'oci_file_storage_file_system',
    defaultSpecs: { storageGb: 500 },
    description: 'Enterprise Shared NFS File System',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F80000" fill-opacity="0.15" stroke="#F80000" stroke-width="2"/>
      <path d="M18 20H46V44C46 46.2 44.2 48 42 48H22C19.8 48 18 46.2 18 44V20Z" stroke="#F80000" stroke-width="3"/>
      <path d="M24 28H40M24 36H36" stroke="#F80000" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'oci_streaming',
    name: 'OCI Streaming Service',
    provider: 'oci',
    category: 'integration',
    brandColor: '#EC4899',
    defaultResourceType: 'oci_streaming_stream',
    defaultSpecs: { count: 1 },
    description: 'Apache Kafka-Compatible Real-time Event Stream',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <path d="M16 28C22 20 28 44 34 24C40 44 46 20 50 34" stroke="#EC4899" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'oci_notifications',
    name: 'OCI Notifications (ONS)',
    provider: 'oci',
    category: 'integration',
    brandColor: '#EC4899',
    defaultResourceType: 'oci_ons_notification_topic',
    defaultSpecs: { count: 1 },
    description: 'Pub/Sub Push Notifications & Webhook Delivery',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <path d="M32 16C25.3726 16 20 21.3726 20 28V36L16 40V42H48V40L44 36V28C44 21.3726 38.6274 16 32 16Z" fill="#EC4899"/>
      <path d="M28 46C28 48.2091 29.7909 50 32 50C34.2091 50 36 48.2091 36 46" stroke="#EC4899" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'oci_iam',
    name: 'OCI Identity & Access (IAM)',
    provider: 'oci',
    category: 'security',
    brandColor: '#10B981',
    defaultResourceType: 'oci_identity_policy',
    defaultSpecs: { count: 1 },
    description: 'Compartments, Domains, Groups & Security Policies',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
      <circle cx="32" cy="24" r="8" fill="#10B981"/>
      <path d="M20 46C20 38 25 35 32 35C39 35 44 38 44 46" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'oci_waf',
    name: 'OCI Web Application Firewall',
    provider: 'oci',
    category: 'security',
    brandColor: '#10B981',
    defaultResourceType: 'oci_waf_web_app_firewall',
    defaultSpecs: { count: 1 },
    description: 'Protection against Layer 7 Web Vulnerabilities',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
      <path d="M32 16L46 22V32C46 41 39 48 32 52C25 48 18 41 18 32V22L32 16Z" fill="#10B981"/>
    </svg>`,
  },
  {
    key: 'oci_generative_ai',
    name: 'OCI Generative AI & AI Services',
    provider: 'oci',
    category: 'ai',
    brandColor: '#EC4899',
    defaultResourceType: 'oci_generative_ai_model',
    defaultSpecs: { count: 1 },
    description: 'Enterprise LLMs, Vision, Speech & Document Understanding',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <path d="M32 16L36 28L48 32L36 36L32 48L28 36L16 32L28 28L32 16Z" fill="#EC4899"/>
    </svg>`,
  },

  // ==========================================
  // Generic / Custom Flowchart Elements (Common to Any Provider)
  // ==========================================
  {
    key: 'generic_user',
    name: 'Usuário / Cliente',
    provider: 'generic',
    category: 'networking',
    brandColor: '#8B5CF6',
    defaultResourceType: 'generic_user',
    defaultSpecs: { count: 1 },
    description: 'Navegador Web, Dispositivo ou Cliente de API',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#8B5CF6" fill-opacity="0.15" stroke="#8B5CF6" stroke-width="2"/>
      <circle cx="32" cy="24" r="8" fill="#8B5CF6"/>
      <path d="M18 48C18 40 24 36 32 36C40 36 46 40 46 48" stroke="#8B5CF6" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'generic_internet',
    name: 'Internet / Nuvem Pública',
    provider: 'generic',
    category: 'networking',
    brandColor: '#0EA5E9',
    defaultResourceType: 'generic_internet',
    defaultSpecs: { count: 1 },
    description: 'Rede Externa ou Tráfego Público',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0EA5E9" fill-opacity="0.15" stroke="#0EA5E9" stroke-width="2"/>
      <path d="M20 40C16 40 14 36 16 32C14 28 18 24 22 24C24 18 32 16 38 20C42 18 48 20 48 26C52 28 52 34 48 38C48 40 44 40 40 40Z" stroke="#0EA5E9" stroke-width="3" stroke-linejoin="round" fill="#0EA5E9" fill-opacity="0.2"/>
    </svg>`,
  },
  {
    key: 'generic_onprem',
    name: 'Servidor On-Premises',
    provider: 'generic',
    category: 'compute',
    brandColor: '#64748B',
    defaultResourceType: 'generic_onprem',
    defaultSpecs: { count: 1 },
    description: 'Data Center Local / Servidor Físico',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#64748B" fill-opacity="0.15" stroke="#64748B" stroke-width="2"/>
      <rect x="16" y="18" width="32" height="12" rx="3" fill="#64748B"/>
      <circle cx="22" cy="24" r="2" fill="white"/>
      <rect x="16" y="34" width="32" height="12" rx="3" fill="#64748B"/>
      <circle cx="22" cy="40" r="2" fill="white"/>
    </svg>`,
  },
  {
    key: 'generic_load_balancer',
    name: 'Balanceador de Carga',
    provider: 'generic',
    category: 'networking',
    brandColor: '#3B82F6',
    defaultResourceType: 'generic_lb',
    defaultSpecs: { count: 1 },
    description: 'Distribuidor de Tráfego HTTP/TCP',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#3B82F6" fill-opacity="0.15" stroke="#3B82F6" stroke-width="2"/>
      <circle cx="20" cy="32" r="5" fill="#3B82F6"/>
      <circle cx="44" cy="20" r="5" fill="#3B82F6"/>
      <circle cx="44" cy="44" r="5" fill="#3B82F6"/>
      <path d="M25 32H34M34 32V20H39M34 32V44H39" stroke="#3B82F6" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'generic_waf',
    name: 'Firewall / WAF',
    provider: 'generic',
    category: 'security',
    brandColor: '#EF4444',
    defaultResourceType: 'generic_waf',
    defaultSpecs: { count: 1 },
    description: 'Firewall de Aplicação & Proteção DDoS',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EF4444" fill-opacity="0.15" stroke="#EF4444" stroke-width="2"/>
      <path d="M32 16L46 22V32C46 41 39 48 32 52C25 48 18 41 18 32V22L32 16Z" fill="#EF4444"/>
    </svg>`,
  },
  {
    key: 'generic_api',
    name: 'API / Microserviço',
    provider: 'generic',
    category: 'integration',
    brandColor: '#10B981',
    defaultResourceType: 'generic_api',
    defaultSpecs: { count: 1 },
    description: 'API Gateway ou Serviço Backend',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
      <path d="M20 24L14 32L20 40M44 24L50 32L44 40M35 18L29 46" stroke="#10B981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'generic_db',
    name: 'Banco de Dados Relacional',
    provider: 'generic',
    category: 'database',
    brandColor: '#2563EB',
    defaultResourceType: 'generic_db',
    defaultSpecs: { storageGb: 100 },
    description: 'PostgreSQL, MySQL, SQL Server ou Oracle',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#2563EB" fill-opacity="0.15" stroke="#2563EB" stroke-width="2"/>
      <ellipse cx="32" cy="20" rx="16" ry="6" fill="#2563EB"/>
      <path d="M16 20V44C16 47.3 23.2 50 32 50C40.8 50 48 47.3 48 44V20" stroke="#2563EB" stroke-width="3"/>
      <path d="M16 32C16 35.3 23.2 38 32 38C40.8 38 48 35.3 48 32" stroke="#2563EB" stroke-width="2"/>
    </svg>`,
  },
  {
    key: 'generic_nosql',
    name: 'Banco NoSQL / Chave-Valor',
    provider: 'generic',
    category: 'database',
    brandColor: '#F59E0B',
    defaultResourceType: 'generic_nosql',
    defaultSpecs: { storageGb: 50 },
    description: 'Documentos, Chave-Valor ou Grafo',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F59E0B" fill-opacity="0.15" stroke="#F59E0B" stroke-width="2"/>
      <path d="M32 16L48 24V40L32 48L16 40V24L32 16Z" stroke="#F59E0B" stroke-width="3" fill="#F59E0B" fill-opacity="0.3"/>
      <path d="M32 24L40 28V36L32 40L24 36V28L32 24Z" fill="#F59E0B"/>
    </svg>`,
  },
  {
    key: 'generic_cache',
    name: 'Memória Cache / Redis',
    provider: 'generic',
    category: 'database',
    brandColor: '#DC2626',
    defaultResourceType: 'generic_cache',
    defaultSpecs: { count: 1 },
    description: 'Cache em Memória de Baixa Latência',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#DC2626" fill-opacity="0.15" stroke="#DC2626" stroke-width="2"/>
      <path d="M18 22L32 16L46 22L32 28L18 22Z" fill="#DC2626"/>
      <path d="M18 32L32 26L46 32L32 38L18 32Z" fill="#DC2626" fill-opacity="0.7"/>
      <path d="M18 42L32 36L46 42L32 48L18 42Z" fill="#DC2626" fill-opacity="0.4"/>
    </svg>`,
  },
  {
    key: 'generic_queue',
    name: 'Fila de Mensagens / Eventos',
    provider: 'generic',
    category: 'integration',
    brandColor: '#EC4899',
    defaultResourceType: 'generic_queue',
    defaultSpecs: { count: 1 },
    description: 'RabbitMQ, Kafka ou Message Queue',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-width="2"/>
      <rect x="16" y="22" width="10" height="20" rx="2" fill="#EC4899"/>
      <rect x="29" y="22" width="10" height="20" rx="2" fill="#EC4899"/>
      <rect x="42" y="22" width="10" height="20" rx="2" fill="#EC4899"/>
      <path d="M16 46H48" stroke="#EC4899" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'generic_storage',
    name: 'Armazenamento de Arquivos',
    provider: 'generic',
    category: 'storage',
    brandColor: '#0284C7',
    defaultResourceType: 'generic_storage',
    defaultSpecs: { storageGb: 500 },
    description: 'Bucket de Objetos ou NAS / NFS',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#0284C7" fill-opacity="0.15" stroke="#0284C7" stroke-width="2"/>
      <path d="M18 20H46V44C46 46.2 44.2 48 42 48H22C19.8 48 18 46.2 18 44V20Z" stroke="#0284C7" stroke-width="3" fill="#0284C7" fill-opacity="0.2"/>
      <path d="M24 28H40M24 36H34" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'generic_security',
    name: 'Cofre de Chaves & Segredos',
    provider: 'generic',
    category: 'security',
    brandColor: '#059669',
    defaultResourceType: 'generic_security',
    defaultSpecs: { count: 1 },
    description: 'Gestão de Certificados e Chaves de Criptografia',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#059669" fill-opacity="0.15" stroke="#059669" stroke-width="2"/>
      <rect x="20" y="28" width="24" height="18" rx="4" fill="#059669"/>
      <path d="M26 28V20C26 16.7 28.7 14 32 14C35.3 14 38 16.7 38 20V28" stroke="#059669" stroke-width="3" stroke-linecap="round"/>
      <circle cx="32" cy="37" r="2" fill="white"/>
    </svg>`,
  },
  {
    key: 'generic_container',
    name: 'Container Docker / K8s',
    provider: 'generic',
    category: 'container',
    brandColor: '#2563EB',
    defaultResourceType: 'generic_container',
    defaultSpecs: { count: 1 },
    description: 'Aplicação Containerizada em Pod ou Task',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#2563EB" fill-opacity="0.15" stroke="#2563EB" stroke-width="2"/>
      <rect x="18" y="20" width="12" height="10" rx="2" fill="#2563EB"/>
      <rect x="34" y="20" width="12" height="10" rx="2" fill="#2563EB"/>
      <rect x="18" y="34" width="12" height="10" rx="2" fill="#2563EB"/>
      <rect x="34" y="34" width="12" height="10" rx="2" fill="#2563EB"/>
    </svg>`,
  },
  {
    key: 'generic_ai',
    name: 'Modelo de IA / LLM',
    provider: 'generic',
    category: 'ai',
    brandColor: '#A855F7',
    defaultResourceType: 'generic_ai',
    defaultSpecs: { count: 1 },
    description: 'Inteligência Artificial, Machine Learning ou LLM',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#A855F7" fill-opacity="0.15" stroke="#A855F7" stroke-width="2"/>
      <path d="M32 16L36 28L48 32L36 36L32 48L28 36L16 32L28 28L32 16Z" fill="#A855F7"/>
      <circle cx="48" cy="18" r="3" fill="#A855F7"/>
    </svg>`,
  },

  // ==========================================
  // DevOps & CI/CD Common Services & Tools
  // ==========================================
  {
    key: 'generic_cicd',
    name: 'Pipeline CI/CD',
    provider: 'generic',
    category: 'devops',
    brandColor: '#F97316',
    defaultResourceType: 'generic_cicd',
    defaultSpecs: { count: 1 },
    description: 'Automação de Build, Testes e Deploy Contínuo (GitHub Actions, Jenkins, GitLab)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F97316" fill-opacity="0.15" stroke="#F97316" stroke-width="2"/>
      <path d="M24 32C24 27.5817 20.4183 24 16 24C11.5817 24 8 27.5817 8 32C8 36.4183 11.5817 40 16 40C20.4183 40 24 36.4183 24 32Z" stroke="#F97316" stroke-width="3"/>
      <path d="M56 32C56 27.5817 52.4183 24 48 24C43.5817 24 40 27.5817 40 32C40 36.4183 43.5817 40 48 40C52.4183 40 56 36.4183 56 32Z" stroke="#F97316" stroke-width="3"/>
      <path d="M22 28L42 36M22 36L42 28" stroke="#F97316" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'generic_git_repo',
    name: 'Repositório Git',
    provider: 'generic',
    category: 'devops',
    brandColor: '#F05032',
    defaultResourceType: 'generic_git_repo',
    defaultSpecs: { count: 1 },
    description: 'Controle de Versão e Repositório de Código (GitHub, GitLab, Bitbucket)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F05032" fill-opacity="0.15" stroke="#F05032" stroke-width="2"/>
      <circle cx="24" cy="20" r="5" stroke="#F05032" stroke-width="3" fill="#F05032" fill-opacity="0.3"/>
      <circle cx="24" cy="44" r="5" stroke="#F05032" stroke-width="3" fill="#F05032" fill-opacity="0.3"/>
      <circle cx="42" cy="32" r="5" stroke="#F05032" stroke-width="3" fill="#F05032"/>
      <path d="M24 25V39M24 28C24 35 42 32 42 27" stroke="#F05032" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'generic_k8s_cluster',
    name: 'Cluster Kubernetes',
    provider: 'generic',
    category: 'devops',
    brandColor: '#326CE5',
    defaultResourceType: 'generic_k8s_cluster',
    defaultSpecs: { count: 1 },
    description: 'Orquestrador de Containers e Pods (K8s Control Plane & Nodes)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#326CE5" fill-opacity="0.15" stroke="#326CE5" stroke-width="2"/>
      <path d="M32 14L48 22V42L32 50L16 42V22L32 14Z" stroke="#326CE5" stroke-width="3" fill="#326CE5" fill-opacity="0.2"/>
      <circle cx="32" cy="32" r="6" fill="#326CE5"/>
      <path d="M32 18V26M32 38V46M20 25L27 29M37 35L44 39M20 39L27 35M37 29L44 25" stroke="#326CE5" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'generic_container_registry',
    name: 'Registro de Containers',
    provider: 'generic',
    category: 'devops',
    brandColor: '#099CEC',
    defaultResourceType: 'generic_container_registry',
    defaultSpecs: { count: 1 },
    description: 'Catálogo e Registro de Imagens Docker (Docker Registry, ECR, GAR, ACR)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#099CEC" fill-opacity="0.15" stroke="#099CEC" stroke-width="2"/>
      <rect x="16" y="18" width="32" height="28" rx="4" stroke="#099CEC" stroke-width="3" fill="#099CEC" fill-opacity="0.2"/>
      <path d="M22 26H28M32 26H38M22 32H28M32 32H38M22 38H38" stroke="#099CEC" stroke-width="3" stroke-linecap="round"/>
      <circle cx="42" cy="42" r="6" fill="#099CEC"/>
    </svg>`,
  },
  {
    key: 'generic_iac_terraform',
    name: 'Infraestrutura como Código (IaC)',
    provider: 'generic',
    category: 'devops',
    brandColor: '#844FBA',
    defaultResourceType: 'generic_iac_terraform',
    defaultSpecs: { count: 1 },
    description: 'Automação e Declarativa de Infraestrutura (Terraform, OpenTofu, Ansible)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#844FBA" fill-opacity="0.15" stroke="#844FBA" stroke-width="2"/>
      <path d="M18 20L30 27V41L18 34V20Z" fill="#844FBA"/>
      <path d="M34 20L46 27V41L34 34V20Z" fill="#844FBA" fill-opacity="0.7"/>
      <path d="M18 44L30 51L46 41L34 34L18 44Z" fill="#844FBA" fill-opacity="0.4"/>
    </svg>`,
  },
  {
    key: 'generic_grafana_metrics',
    name: 'Métricas & Observabilidade',
    provider: 'generic',
    category: 'devops',
    brandColor: '#F47B20',
    defaultResourceType: 'generic_grafana_metrics',
    defaultSpecs: { count: 1 },
    description: 'Dashboards de Métricas e Alertas (Prometheus, Grafana, Datadog)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#F47B20" fill-opacity="0.15" stroke="#F47B20" stroke-width="2"/>
      <path d="M16 46L26 34L36 40L48 20" stroke="#F47B20" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="48" cy="20" r="4" fill="#F47B20"/>
      <path d="M16 48H48" stroke="#F47B20" stroke-width="2"/>
    </svg>`,
  },
  {
    key: 'generic_logging_elk',
    name: 'Central de Logs',
    provider: 'generic',
    category: 'devops',
    brandColor: '#005571',
    defaultResourceType: 'generic_logging_elk',
    defaultSpecs: { count: 1 },
    description: 'Agregação, Análise e Busca de Logs (ELK Stack, Loki, Fluentd)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#005571" fill-opacity="0.25" stroke="#00A3E0" stroke-width="2"/>
      <rect x="18" y="16" width="28" height="32" rx="3" stroke="#00A3E0" stroke-width="3" fill="#005571" fill-opacity="0.3"/>
      <path d="M24 24H40M24 30H36M24 36H32" stroke="#00A3E0" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="42" cy="42" r="7" fill="#00A3E0"/>
      <path d="M47 47L52 52" stroke="#00A3E0" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    key: 'generic_argocd_gitops',
    name: 'GitOps & Deploy (ArgoCD)',
    provider: 'generic',
    category: 'devops',
    brandColor: '#EF7B4D',
    defaultResourceType: 'generic_argocd_gitops',
    defaultSpecs: { count: 1 },
    description: 'Entrega Contínua Declarativa GitOps (ArgoCD, FluxCD)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EF7B4D" fill-opacity="0.15" stroke="#EF7B4D" stroke-width="2"/>
      <circle cx="32" cy="32" r="14" stroke="#EF7B4D" stroke-width="3"/>
      <path d="M26 22L38 22L34 18M38 42L26 42L30 46" stroke="#EF7B4D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'generic_artifact_registry',
    name: 'Gerenciador de Artefatos',
    provider: 'generic',
    category: 'devops',
    brandColor: '#10B981',
    defaultResourceType: 'generic_artifact_registry',
    defaultSpecs: { count: 1 },
    description: 'Repositório de Pacotes e Libs (Nexus, JFrog Artifactory, npm, PyPI)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
      <path d="M32 16L48 24V40L32 48L16 40V24L32 16Z" stroke="#10B981" stroke-width="3" fill="#10B981" fill-opacity="0.2"/>
      <path d="M16 24L32 32L48 24M32 32V48" stroke="#10B981" stroke-width="3"/>
    </svg>`,
  },
  {
    key: 'generic_sonarqube',
    name: 'Qualidade & Segurança de Código',
    provider: 'generic',
    category: 'devops',
    brandColor: '#4E9BCD',
    defaultResourceType: 'generic_sonarqube',
    defaultSpecs: { count: 1 },
    description: 'Análise Estática, Vulnerabilidades e Code Smells (SonarQube)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#4E9BCD" fill-opacity="0.15" stroke="#4E9BCD" stroke-width="2"/>
      <path d="M32 16L46 22V32C46 41 39 48 32 52C25 48 18 41 18 32V22L32 16Z" fill="#4E9BCD" fill-opacity="0.3" stroke="#4E9BCD" stroke-width="2"/>
      <path d="M26 32L30 36L38 28" stroke="#4E9BCD" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    key: 'generic_runner_worker',
    name: 'Runner / CI Worker',
    provider: 'generic',
    category: 'devops',
    brandColor: '#EAB308',
    defaultResourceType: 'generic_runner_worker',
    defaultSpecs: { count: 1 },
    description: 'Agente de Execução de Jobs de CI/CD (Self-Hosted Runner, Jenkins Node)',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EAB308" fill-opacity="0.15" stroke="#EAB308" stroke-width="2"/>
      <rect x="18" y="20" width="28" height="24" rx="4" stroke="#EAB308" stroke-width="3" fill="#EAB308" fill-opacity="0.2"/>
      <path d="M33 14L27 28H35L29 42" stroke="#EAB308" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  }
];

export const getIconByKey = (key: string): CloudIconDefinition | undefined => {
  return CLOUD_ICONS.find((icon) => icon.key === key);
};
