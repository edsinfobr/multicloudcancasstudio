import { DiagramNode, DiagramLink } from '../types';

export interface ProtocolSuggestion {
  label: string;
  protocol: DiagramLink['protocol'];
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
  description: string;
}

export function inferProtocolForLink(fromNode?: DiagramNode, toNode?: DiagramNode): ProtocolSuggestion {
  if (!fromNode || !toNode) {
    return {
      label: 'HTTPS / 443',
      protocol: 'HTTPS',
      style: 'solid',
      color: '#38BDF8',
      description: 'Tráfego seguro padrão'
    };
  }

  const fromCat = fromNode.category;
  const toCat = toNode.category;

  const fromKey = (fromNode.iconKey || '').toLowerCase();
  const toKey = (toNode.iconKey || '').toLowerCase();

  const fromRes = (fromNode.resourceType || '').toLowerCase();
  const toRes = (toNode.resourceType || '').toLowerCase();

  // 1. User / Internet / Client -> Load Balancer / WAF / CloudFront / API Gateway
  if (
    fromKey.includes('user') ||
    fromKey.includes('internet') ||
    fromRes.includes('user') ||
    fromRes.includes('client')
  ) {
    return {
      label: 'HTTPS / 443',
      protocol: 'HTTPS',
      style: 'solid',
      color: '#0EA5E9',
      description: 'Tráfego Web do Cliente (SSL/TLS)'
    };
  }

  // 2. Load Balancer / API Gateway / WAF / Ingress -> Compute (EC2, Lambda, Pod, Cloud Run, VM)
  if (
    fromRes.includes('alb') ||
    fromRes.includes('nlb') ||
    fromRes.includes('lb') ||
    fromRes.includes('apigw') ||
    fromRes.includes('waf') ||
    fromRes.includes('cloudfront') ||
    fromKey.includes('load_balancer') ||
    fromKey.includes('gateway')
  ) {
    if (toCat === 'compute' || toCat === 'container') {
      return {
        label: 'HTTP / 8080',
        protocol: 'HTTP',
        style: 'solid',
        color: '#10B981',
        description: 'Encaminhamento para Aplicação Backend'
      };
    }
  }

  // 3. Compute -> Database
  if (toCat === 'database') {
    // Redis / Cache
    if (toKey.includes('cache') || toKey.includes('redis') || toRes.includes('cache') || toRes.includes('redis')) {
      return {
        label: 'Redis / 6379',
        protocol: 'TCP',
        style: 'solid',
        color: '#DC2626',
        description: 'Acesso a Cache em Memória'
      };
    }

    // NoSQL / DynamoDB / Cosmos / MongoDB
    if (
      toKey.includes('nosql') ||
      toKey.includes('dynamo') ||
      toKey.includes('cosmos') ||
      toKey.includes('mongo') ||
      toKey.includes('firestore') ||
      toKey.includes('table')
    ) {
      return {
        label: 'HTTPS / 443',
        protocol: 'HTTPS',
        style: 'solid',
        color: '#F59E0B',
        description: 'API NoSQL sobre HTTPS'
      };
    }

    // MySQL
    if (toKey.includes('mysql') || toRes.includes('mysql')) {
      return {
        label: 'SQL / 3306',
        protocol: 'SQL',
        style: 'solid',
        color: '#2563EB',
        description: 'Conexão Banco de Dados MySQL'
      };
    }

    // Standard Relational SQL (Postgres / Aurora / SQL Server / Cloud SQL / RDS)
    return {
      label: 'SQL / 5432',
      protocol: 'SQL',
      style: 'solid',
      color: '#2563EB',
      description: 'Conexão Banco de Dados Relacional (SQL)'
    };
  }

  // 4. Compute -> Queue / Messaging / Event Bus
  if (toCat === 'integration' || toKey.includes('queue') || toKey.includes('pubsub') || toKey.includes('kafka') || toKey.includes('sqs') || toKey.includes('event')) {
    if (toKey.includes('kafka') || toRes.includes('kafka')) {
      return {
        label: 'Kafka / 9092',
        protocol: 'TCP',
        style: 'dashed',
        color: '#EC4899',
        description: 'Streaming de Eventos Kafka'
      };
    }
    if (toKey.includes('rabbit') || toRes.includes('amqp')) {
      return {
        label: 'AMQP / 5672',
        protocol: 'TCP',
        style: 'dashed',
        color: '#EC4899',
        description: 'Fila de Mensagens AMQP'
      };
    }
    return {
      label: 'HTTPS / 443',
      protocol: 'HTTPS',
      style: 'dashed',
      color: '#EC4899',
      description: 'Publicação de Mensagens / Eventos'
    };
  }

  // 5. Compute -> Storage
  if (toCat === 'storage') {
    if (toKey.includes('efs') || toKey.includes('nfs') || toRes.includes('nfs') || toRes.includes('filestore')) {
      return {
        label: 'NFS / 2049',
        protocol: 'TCP',
        style: 'solid',
        color: '#0284C7',
        description: 'Montagem de Sistema de Arquivos Compartilhado'
      };
    }
    return {
      label: 'HTTPS / 443',
      protocol: 'HTTPS',
      style: 'solid',
      color: '#0284C7',
      description: 'Acesso a Bucket de Objetos'
    };
  }

  // 6. Compute -> Security / Key Vault / KMS
  if (toCat === 'security' || toKey.includes('vault') || toKey.includes('kms') || toKey.includes('secret')) {
    return {
      label: 'mTLS / 443',
      protocol: 'HTTPS',
      style: 'solid',
      color: '#059669',
      description: 'Consulta de Segredos com mTLS'
    };
  }

  // 7. Compute -> Compute (Microservice communication)
  if ((fromCat === 'compute' || fromCat === 'container') && (toCat === 'compute' || toCat === 'container')) {
    return {
      label: 'gRPC / 50051',
      protocol: 'gRPC',
      style: 'solid',
      color: '#10B981',
      description: 'Comunicação síncrona de alta performance'
    };
  }

  // Default fallback
  return {
    label: 'HTTPS / 443',
    protocol: 'HTTPS',
    style: 'solid',
    color: '#38BDF8',
    description: 'Tráfego de Comunicação Genérico'
  };
}
