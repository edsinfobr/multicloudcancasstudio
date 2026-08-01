import { DiagramNode, CostItem, MultiCloudCostComparison } from '../types';

// Baseline hourly prices for standard instances / services (USD)
const BASE_PRICING: Record<string, number> = {
  // AWS
  't3.small': 0.0208,
  't3.medium': 0.0416,
  't3.large': 0.0832,
  'c6i.xlarge': 0.17,
  'db.r6g.xlarge': 0.48,
  'aws_lambda': 0.0000002, // per invocation
  'aws_s3_gb': 0.023, // monthly per GB
  'aws_alb_hr': 0.0225,
  'aws_cloudfront_gb': 0.085,

  // Azure
  'Standard_B2s': 0.0416,
  'Standard_D2s_v3': 0.096,
  'Standard_D4s_v3': 0.192,
  'azure_sql_dtu': 0.02,
  'azure_blob_gb': 0.018,

  // GCP
  'e2-micro': 0.0084,
  'e2-standard-2': 0.067,
  'e2-standard-4': 0.134,
  'gcp_cloud_sql': 0.11,
  'gcp_gcs_gb': 0.02,

  // OCI
  'VM.Standard2.1': 0.0638,
  'VM.Standard.E4.Flex': 0.048,
  'oci_autonomous_db': 0.33,
  'oci_object_gb': 0.0255
};

export const calculateNodeCost = (node: DiagramNode): CostItem => {
  const hours = node.specs.hoursPerMonth || 730;
  const count = node.specs.count || 1;
  const storageGb = node.specs.storageGb || 0;
  const transferGb = node.specs.transferGb || 0;
  const instanceType = node.specs.instanceType || '';

  let unitCostHr = 0;
  let monthlyCost = 0;
  let details = '';

  if (BASE_PRICING[instanceType]) {
    unitCostHr = BASE_PRICING[instanceType];
    monthlyCost = unitCostHr * hours * count;
    details = `${count}x ${instanceType} @ $${unitCostHr.toFixed(4)}/hr (${hours} hrs/mo)`;
  } else if (node.category === 'compute') {
    unitCostHr = 0.08;
    monthlyCost = unitCostHr * hours * count;
    details = `${count}x Compute Node @ ~$${unitCostHr}/hr`;
  } else if (node.category === 'storage') {
    const pricePerGb = BASE_PRICING[`${node.provider}_s3_gb`] || 0.023;
    monthlyCost = storageGb * pricePerGb + transferGb * 0.08;
    details = `${storageGb} GB Storage @ $${pricePerGb}/GB + ${transferGb} GB Outbound`;
  } else if (node.category === 'database') {
    unitCostHr = 0.25;
    monthlyCost = unitCostHr * hours * count + storageGb * 0.11;
    details = `${count}x DB Instance @ ~$${unitCostHr}/hr + ${storageGb} GB Storage`;
  } else if (node.category === 'networking') {
    unitCostHr = 0.025;
    monthlyCost = unitCostHr * hours * count + transferGb * 0.085;
    details = `Load Balancer/CDN Base + Data Transfer`;
  } else if (node.category === 'container') {
    unitCostHr = 0.10;
    monthlyCost = unitCostHr * hours * count;
    details = `${count} Node K8s Cluster`;
  } else if (node.category === 'ai') {
    monthlyCost = 150 * count;
    details = `AI Endpoint Base Allocation`;
  } else {
    monthlyCost = 15.0;
    details = `Standard Base Charge`;
  }

  // Storage cost addition
  if (storageGb > 0 && node.category === 'compute') {
    monthlyCost += storageGb * 0.10;
    details += ` + ${storageGb}GB EBS Disk`;
  }

  return {
    nodeId: node.id,
    nodeName: node.name,
    provider: node.provider,
    category: node.category,
    serviceType: instanceType || node.iconKey,
    unitCostHr,
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    annualCost: Math.round(monthlyCost * 12 * 100) / 100,
    details
  };
};

export const calculateTotalCost = (nodes: DiagramNode[]): {
  items: CostItem[];
  totalMonthly: number;
  totalAnnual: number;
  byProvider: Record<string, number>;
  byCategory: Record<string, number>;
  multiCloudComparison: MultiCloudCostComparison;
} => {
  const items = nodes.map(calculateNodeCost);
  const totalMonthly = Math.round(items.reduce((acc, item) => acc + item.monthlyCost, 0) * 100) / 100;
  const totalAnnual = Math.round(totalMonthly * 12 * 100) / 100;

  const byProvider: Record<string, number> = { aws: 0, azure: 0, gcp: 0, oci: 0, generic: 0 };
  const byCategory: Record<string, number> = {};

  items.forEach((item) => {
    byProvider[item.provider] = (byProvider[item.provider] || 0) + item.monthlyCost;
    byCategory[item.category] = (byCategory[item.category] || 0) + item.monthlyCost;
  });

  // Calculate estimated equivalent multi-cloud totals
  const baseVal = totalMonthly > 0 ? totalMonthly : 100;
  const multiCloudComparison: MultiCloudCostComparison = {
    awsMonthly: Math.round(baseVal * 1.0 * 100) / 100,
    azureMonthly: Math.round(baseVal * 0.94 * 100) / 100,
    gcpMonthly: Math.round(baseVal * 0.88 * 100) / 100,
    ociMonthly: Math.round(baseVal * 0.76 * 100) / 100 // OCI is famous for aggressive compute pricing
  };

  return {
    items,
    totalMonthly,
    totalAnnual,
    byProvider,
    byCategory,
    multiCloudComparison
  };
};
