export type CloudProvider = 'aws' | 'azure' | 'gcp' | 'oci' | 'generic';

export type ServiceCategory = 
  | 'compute' 
  | 'storage' 
  | 'database' 
  | 'networking' 
  | 'security' 
  | 'analytics' 
  | 'ai' 
  | 'container'
  | 'integration'
  | 'devops';

export interface ResourceSpecs {
  instanceType?: string;
  count?: number;
  storageGb?: number;
  transferGb?: number;
  hoursPerMonth?: number;
  region?: string;
  isPublic?: boolean;
  engine?: string;
  tier?: string;
  customPricePerHr?: number;
  minSize?: number;
  maxSize?: number;
  desiredCapacity?: number;
  volumeType?: string;
  nodeType?: string;
  shardCount?: number;
}

export interface DiagramContainer {
  id: string;
  name: string;
  provider: CloudProvider;
  type: 'vpc' | 'subnet' | 'resource_group' | 'compartment' | 'custom';
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  borderStyle?: 'dashed' | 'solid' | 'dotted';
  isPublicSubnet?: boolean;
}

export interface DiagramNode {
  id: string;
  name: string;
  provider: CloudProvider;
  category: ServiceCategory;
  iconKey: string;
  resourceType: string; // Terraform resource type e.g. aws_instance
  containerId?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  specs: ResourceSpecs;
  tags?: Record<string, string>;
  notes?: string;
}

export interface DiagramLink {
  id: string;
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted';
  arrowHead?: 'end' | 'both' | 'start' | 'none';
  color?: string;
  strokeWidth?: number;
  protocol?: 'HTTP' | 'HTTPS' | 'TCP' | 'UDP' | 'gRPC' | 'SQL' | 'Peering' | 'Internal' | 'Docker' | 'Redis' | 'AMQP' | 'Kafka' | 'DynamoDB' | 'SQS' | 'SNS' | 'Custom';
}

export interface DiagramMetadata {
  project?: string;
  author?: string;
  role?: string;
  date?: string;
  tags?: string[];
  showOnCanvas?: boolean;
  x?: number;
  y?: number;
}

export interface DiagramState {
  id: string;
  title: string;
  description: string;
  primaryProvider: CloudProvider;
  containers: DiagramContainer[];
  nodes: DiagramNode[];
  links: DiagramLink[];
  createdAt: string;
  updatedAt: string;
  metadata?: DiagramMetadata;
}

export interface CloudIconDefinition {
  key: string;
  name: string;
  provider: CloudProvider;
  category: ServiceCategory;
  svg: string;
  defaultResourceType: string;
  defaultSpecs: ResourceSpecs;
  description: string;
  brandColor: string;
}

export interface CostItem {
  nodeId: string;
  nodeName: string;
  provider: CloudProvider;
  category: ServiceCategory;
  serviceType: string;
  unitCostHr: number;
  monthlyCost: number;
  annualCost: number;
  details: string;
}

export interface MultiCloudCostComparison {
  awsMonthly: number;
  azureMonthly: number;
  gcpMonthly: number;
  ociMonthly: number;
}

export interface SecurityAuditResult {
  haScore: number;
  securityScore: number;
  costScore: number;
  overallRating: string;
  summary: string;
  securityFindings: string[];
  haRecommendations: string[];
  costSavingsTips: string[];
  suggestedAdditions?: string[];
}
