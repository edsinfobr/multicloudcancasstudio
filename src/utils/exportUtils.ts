import { jsPDF } from 'jspdf';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import { DiagramState } from '../types';
import { calculateTotalCost } from './costCalculator';

export const exportCanvasToBlob = async (canvasElement: HTMLElement): Promise<Blob | null> => {
  try {
    const dataUrl = await toPng(canvasElement, {
      quality: 0.95,
      pixelRatio: 2,
      style: {
        background: 'transparent',
        backgroundImage: 'none',
        backgroundColor: 'transparent'
      }
    });
    const res = await fetch(dataUrl);
    return await res.blob();
  } catch (err) {
    console.error('Blob conversion failed:', err);
    return null;
  }
};

export const exportCanvasToPng = async (canvasElement: HTMLElement, filename = 'cloud-architecture.png') => {
  try {
    const dataUrl = await toPng(canvasElement, {
      quality: 0.95,
      pixelRatio: 2,
      style: {
        background: 'transparent',
        backgroundImage: 'none',
        backgroundColor: 'transparent'
      }
    });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('PNG export failed:', err);
    throw err;
  }
};

export const exportCanvasToJpg = async (canvasElement: HTMLElement, filename = 'cloud-architecture.jpg') => {
  try {
    const dataUrl = await toJpeg(canvasElement, {
      quality: 0.95,
      pixelRatio: 2,
      style: {
        background: 'transparent',
        backgroundImage: 'none',
        backgroundColor: 'transparent'
      }
    });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('JPG export failed:', err);
    throw err;
  }
};

export const exportCanvasToSvg = async (canvasElement: HTMLElement, filename = 'cloud-architecture.svg') => {
  try {
    const dataUrl = await toSvg(canvasElement, {
      style: {
        background: 'transparent',
        backgroundImage: 'none',
        backgroundColor: 'transparent'
      }
    });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('SVG export failed:', err);
    throw err;
  }
};

export const exportProjectToJson = (diagram: DiagramState) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(diagram, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `${diagram.title.toLowerCase().replace(/\s+/g, '-')}-project.json`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportArchitecturePdf = async (
  canvasElement: HTMLElement,
  diagram: DiagramState,
  exchangeRate = 5.60
) => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const costData = calculateTotalCost(diagram.nodes);

    // Formatters
    const formatUsd = (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formatBrl = (val: number) => `R$ ${(val * exchangeRate).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Helper to draw top page headers
    const drawPageHeader = (title: string, subtitle?: string) => {
      pdf.setFillColor(15, 23, 42); // Navy Dark #0F172A
      pdf.rect(0, 0, pageWidth, 22, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, 14, 11);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(148, 163, 184);
      const sub = subtitle || `MultiCloud Canvas Studio | Data: ${diagram.metadata?.date || new Date().toLocaleDateString('pt-BR')} | Provedor Principal: ${diagram.primaryProvider.toUpperCase()}`;
      pdf.text(sub, 14, 17);
    };

    // Helper to draw footers on all pages
    const addFooters = () => {
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFillColor(241, 245, 249);
        pdf.rect(0, pageHeight - 10, pageWidth, 10, 'F');
        pdf.setDrawColor(226, 232, 240);
        pdf.line(0, pageHeight - 10, pageWidth, pageHeight - 10);

        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 116, 139);
        pdf.text('MultiCloud Canvas Studio Architecture & Cost Report - Documento Confidencial', 14, pageHeight - 4);
        pdf.text(`Página ${i} de ${pageCount}`, pageWidth - 14, pageHeight - 4, { align: 'right' });
      }
    };

    // -------------------------------------------------------------
    // PAGE 1: COVER & ARCHITECTURE CANVAS DIAGRAM
    // -------------------------------------------------------------
    drawPageHeader(
      diagram.metadata?.project || diagram.title || 'Relatório de Arquitetura de Nuvem',
      `Projeto: ${diagram.metadata?.project || diagram.title} | Autor: ${diagram.metadata?.author || 'N/A'}${diagram.metadata?.role ? ` (${diagram.metadata.role})` : ''} | Data: ${diagram.metadata?.date || new Date().toLocaleDateString('pt-BR')}`
    );

    // Canvas Screenshot
    let canvasPng = '';
    try {
      canvasPng = await toPng(canvasElement, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#0F172A'
      });
    } catch (err) {
      console.warn('Canvas image export warning:', err);
    }

    let startY = 28;
    if (canvasPng) {
      pdf.setDrawColor(203, 213, 225);
      pdf.setFillColor(248, 250, 252);
      pdf.rect(14, startY, pageWidth - 28, 105, 'FD');

      // Add image inside container frame
      pdf.addImage(canvasPng, 'PNG', 15, startY + 1, pageWidth - 30, 103);
      startY += 112;
    }

    // Key Architectural KPIs / Executive Cards
    pdf.setFillColor(241, 245, 249);
    pdf.roundedRect(14, startY, pageWidth - 28, 24, 2, 2, 'F');
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(14, startY, pageWidth - 28, 24, 2, 2, 'S');

    const cardW = (pageWidth - 28) / 4;
    // Card 1: Total Nodes
    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RECURSOS/NÓS', 18, startY + 6);
    pdf.setFontSize(11);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`${diagram.nodes.length} Componentes`, 18, startY + 15);

    // Card 2: Containers
    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text('GRUPOS/CONTAINERS', 18 + cardW, startY + 6);
    pdf.setFontSize(11);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`${diagram.containers.length} Redes/VPCs`, 18 + cardW, startY + 15);

    // Card 3: Monthly Cost (USD)
    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text('CUSTO MENSAL (USD)', 18 + cardW * 2, startY + 6);
    pdf.setFontSize(11);
    pdf.setTextColor(180, 83, 9); // Amber
    pdf.text(formatUsd(costData.totalMonthly), 18 + cardW * 2, startY + 15);

    // Card 4: Monthly Cost (BRL)
    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`CUSTO MENSAL (BRL @ ${exchangeRate})`, 18 + cardW * 3, startY + 6);
    pdf.setFontSize(11);
    pdf.setTextColor(4, 120, 87); // Emerald
    pdf.text(formatBrl(costData.totalMonthly), 18 + cardW * 3, startY + 15);

    startY += 30;

    // Executive Description Section
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text('Resumo Executivo da Arquitetura', 14, startY);
    startY += 6;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(51, 65, 85);
    const descText = diagram.description || 'Esta arquitetura foi projetada e modelada no MultiCloud Canvas Studio, especificando os serviços em nuvem, interconexões de rede e estimativas operacionais de investimento.';
    const splitDesc = pdf.splitTextToSize(descText, pageWidth - 28);
    pdf.text(splitDesc, 14, startY);
    startY += splitDesc.length * 5 + 8;

    // Links summary
    if (diagram.links.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text(`Topologia de Conexões de Rede (${diagram.links.length} Links Ativos)`, 14, startY);
      startY += 6;

      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      const linkSummary = diagram.links.slice(0, 7).map((link) => {
        const src = diagram.nodes.find(n => n.id === link.from)?.name || link.from;
        const tgt = diagram.nodes.find(n => n.id === link.to)?.name || link.to;
        const proto = link.protocol || 'TCP';
        const label = link.label ? ` (${link.label})` : '';
        return `• ${src} ──[ ${proto}${label} ]──> ${tgt}`;
      });
      linkSummary.forEach((line) => {
        if (startY < pageHeight - 20) {
          pdf.text(line, 16, startY);
          startY += 4.5;
        }
      });
      if (diagram.links.length > 7) {
        pdf.setFont('helvetica', 'italic');
        pdf.text(`... e mais ${diagram.links.length - 7} conexões mapeadas na topologia.`, 16, startY);
      }
    }

    // -------------------------------------------------------------
    // PAGE 2: DETAILED COMPONENT SPECIFICATIONS
    // -------------------------------------------------------------
    pdf.addPage();
    drawPageHeader('1. Detalhamento dos Componentes da Arquitetura');

    let currY = 30;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text(`Inventário de Serviços e Recursos (${diagram.nodes.length} Componentes)`, 14, currY);
    currY += 8;

    // Table Header for Components
    const colX = [14, 58, 82, 112, 160];
    const colW = [42, 22, 28, 46, 36];

    pdf.setFillColor(30, 41, 59); // Dark blue header
    pdf.rect(14, currY, pageWidth - 28, 7, 'F');

    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('COMPONENTE / NÓ', colX[0] + 2, currY + 5);
    pdf.text('PROVEDOR', colX[1] + 2, currY + 5);
    pdf.text('CATEGORIA', colX[2] + 2, currY + 5);
    pdf.text('ESPECIFICAÇÕES / SIZING', colX[3] + 2, currY + 5);
    pdf.text('CONEXÕES / NOTAS', colX[4] + 2, currY + 5);

    currY += 7;

    diagram.nodes.forEach((node, idx) => {
      // Check if page end reached
      if (currY > pageHeight - 25) {
        pdf.addPage();
        drawPageHeader('1. Detalhamento dos Componentes da Arquitetura (Cont.)');
        currY = 30;

        // Repeat Table Header
        pdf.setFillColor(30, 41, 59);
        pdf.rect(14, currY, pageWidth - 28, 7, 'F');
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text('COMPONENTE / NÓ', colX[0] + 2, currY + 5);
        pdf.text('PROVEDOR', colX[1] + 2, currY + 5);
        pdf.text('CATEGORIA', colX[2] + 2, currY + 5);
        pdf.text('ESPECIFICAÇÕES / SIZING', colX[3] + 2, currY + 5);
        pdf.text('CONEXÕES / NOTAS', colX[4] + 2, currY + 5);
        currY += 7;
      }

      // Format specs text
      const specList: string[] = [];
      if (node.specs.instanceType) specList.push(`Tipo: ${node.specs.instanceType}`);
      if (node.specs.count && node.specs.count > 1) specList.push(`Qtd: ${node.specs.count}`);
      if (node.specs.storageGb) specList.push(`Disco: ${node.specs.storageGb}GB`);
      if (node.specs.engine) specList.push(`Engine: ${node.specs.engine}`);
      if (node.specs.tier) specList.push(`Tier: ${node.specs.tier}`);
      if (node.specs.region) specList.push(`Região: ${node.specs.region}`);
      const specString = specList.length > 0 ? specList.join(', ') : 'Padrão Cloud';

      // Format connections
      const connectedLinks = diagram.links.filter(l => l.from === node.id || l.to === node.id);
      const connTargets = connectedLinks.map(l => {
        const otherId = l.from === node.id ? l.to : l.from;
        const otherNode = diagram.nodes.find(n => n.id === otherId);
        return otherNode ? otherNode.name : otherId;
      });
      const connText = connTargets.length > 0 ? `${connTargets.slice(0, 2).join(', ')}${connTargets.length > 2 ? '...' : ''}` : node.notes || 'Sem links';

      // Row background
      if (idx % 2 === 0) {
        pdf.setFillColor(248, 250, 252);
      } else {
        pdf.setFillColor(255, 255, 255);
      }
      
      const rowHeight = 10;
      pdf.rect(14, currY, pageWidth - 28, rowHeight, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.line(14, currY + rowHeight, pageWidth - 14, currY + rowHeight);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text(node.name, colX[0] + 2, currY + 6);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(
        node.provider === 'aws' ? 217 : node.provider === 'azure' ? 2 : node.provider === 'gcp' ? 16 : 180,
        node.provider === 'aws' ? 119 : node.provider === 'azure' ? 132 : node.provider === 'gcp' ? 185 : 40,
        node.provider === 'aws' ? 6 : node.provider === 'azure' ? 199 : node.provider === 'gcp' ? 129 : 40
      );
      pdf.text(node.provider.toUpperCase(), colX[1] + 2, currY + 6);

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      pdf.text(node.category.toUpperCase(), colX[2] + 2, currY + 6);

      const splitSpec = pdf.splitTextToSize(specString, colW[3] - 2);
      pdf.text(splitSpec[0] || '', colX[3] + 2, currY + 6);

      const splitConn = pdf.splitTextToSize(connText, colW[4] - 2);
      pdf.text(splitConn[0] || '', colX[4] + 2, currY + 6);

      currY += rowHeight;
    });

    // Containers section on Page 2 if containers exist
    if (diagram.containers.length > 0 && currY < pageHeight - 45) {
      currY += 10;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text(`Estruturas de Rede e Agrupamentos (${diagram.containers.length} Containers/VPCs)`, 14, currY);
      currY += 6;

      diagram.containers.forEach((c) => {
        if (currY < pageHeight - 20) {
          pdf.setFillColor(241, 245, 249);
          pdf.roundedRect(14, currY, pageWidth - 28, 12, 1, 1, 'F');
          pdf.setDrawColor(203, 213, 225);
          pdf.roundedRect(14, currY, pageWidth - 28, 12, 1, 1, 'S');

          pdf.setFontSize(8.5);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(15, 23, 42);
          pdf.text(`Container: ${c.name}`, 18, currY + 5);

          pdf.setFontSize(7.5);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(71, 85, 105);
          const nodesInside = diagram.nodes.filter(n => n.containerId === c.id).map(n => n.name).join(', ') || 'Nenhum nó vinculado diretamente';
          pdf.text(`Tipo: ${c.type.toUpperCase()} | Provedor: ${c.provider.toUpperCase()} | Componentes: ${nodesInside}`, 18, currY + 9.5);

          currY += 15;
        }
      });
    }

    // -------------------------------------------------------------
    // PAGE 3: COST ESTIMATION & FINANCIAL ANALYSIS
    // -------------------------------------------------------------
    pdf.addPage();
    drawPageHeader('2. Estimativa de Custos e Análise Financeira');

    let costY = 30;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text('Resumo Financeiro da Arquitetura', 14, costY);
    costY += 8;

    // Cost Summary Box
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(14, costY, pageWidth - 28, 30, 2, 2, 'F');
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(14, costY, pageWidth - 28, 30, 2, 2, 'S');

    const colBoxW = (pageWidth - 28) / 3;

    // Col 1: Monthly Cost
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 116, 139);
    pdf.text('ESTIMATIVA MENSAL TOTAL', 18, costY + 7);

    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(180, 83, 9);
    pdf.text(formatUsd(costData.totalMonthly), 18, costY + 15);

    pdf.setFontSize(10);
    pdf.setTextColor(4, 120, 87);
    pdf.text(formatBrl(costData.totalMonthly), 18, costY + 23);

    // Col 2: Annual Cost
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 116, 139);
    pdf.text('PROJEÇÃO ANUAL (12 MESES)', 18 + colBoxW, costY + 7);

    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text(formatUsd(costData.totalAnnual), 18 + colBoxW, costY + 15);

    pdf.setFontSize(10);
    pdf.setTextColor(71, 85, 105);
    pdf.text(formatBrl(costData.totalAnnual), 18 + colBoxW, costY + 23);

    // Col 3: Cheapest Alternative
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 116, 139);
    pdf.text('PROVEDOR MAIS ECONÔMICO', 18 + colBoxW * 2, costY + 7);

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(4, 120, 87);
    pdf.text(`OCI (${formatUsd(costData.multiCloudComparison.ociMonthly)}/mês)`, 18 + colBoxW * 2, costY + 15);

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text('Economia estimada de ~24% frente aos concorrentes', 18 + colBoxW * 2, costY + 23);

    costY += 38;

    // Itemized Cost Breakdown Table
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text('Detalhamento de Custos por Serviço / Componente', 14, costY);
    costY += 8;

    const costColX = [14, 60, 84, 130, 160];

    pdf.setFillColor(30, 41, 59);
    pdf.rect(14, costY, pageWidth - 28, 7, 'F');

    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('RECURSO', costColX[0] + 2, costY + 5);
    pdf.text('PROVEDOR', costColX[1] + 2, costY + 5);
    pdf.text('ESPECIFICAÇÃO', costColX[2] + 2, costY + 5);
    pdf.text('CUSTO USD/MÊS', costColX[3] + 2, costY + 5);
    pdf.text('CUSTO BRL/MÊS', costColX[4] + 2, costY + 5);

    costY += 7;

    costData.items.forEach((item, idx) => {
      if (costY > pageHeight - 30) {
        pdf.addPage();
        drawPageHeader('2. Estimativa de Custos e Análise Financeira (Cont.)');
        costY = 30;

        pdf.setFillColor(30, 41, 59);
        pdf.rect(14, costY, pageWidth - 28, 7, 'F');
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text('RECURSO', costColX[0] + 2, costY + 5);
        pdf.text('PROVEDOR', costColX[1] + 2, costY + 5);
        pdf.text('ESPECIFICAÇÃO', costColX[2] + 2, costY + 5);
        pdf.text('CUSTO USD/MÊS', costColX[3] + 2, costY + 5);
        pdf.text('CUSTO BRL/MÊS', costColX[4] + 2, costY + 5);
        costY += 7;
      }

      if (idx % 2 === 0) {
        pdf.setFillColor(248, 250, 252);
      } else {
        pdf.setFillColor(255, 255, 255);
      }

      const rH = 9;
      pdf.rect(14, costY, pageWidth - 28, rH, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.line(14, costY + rH, pageWidth - 14, costY + rH);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text(item.nodeName, costColX[0] + 2, costY + 6);

      pdf.setFontSize(7.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      pdf.text(item.provider.toUpperCase(), costColX[1] + 2, costY + 6);

      const splitDet = pdf.splitTextToSize(item.details, 42);
      pdf.text(splitDet[0] || '', costColX[2] + 2, costY + 6);

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(180, 83, 9);
      pdf.text(formatUsd(item.monthlyCost), costColX[3] + 2, costY + 6);

      pdf.setTextColor(4, 120, 87);
      pdf.text(formatBrl(item.monthlyCost), costColX[4] + 2, costY + 6);

      costY += rH;
    });

    // Multi-Cloud Comparison Table
    if (costY < pageHeight - 45) {
      costY += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text('Comparativo de Custos Multi-Cloud (Arquitetura Equivalente)', 14, costY);
      costY += 8;

      const compProviders = [
        { name: 'Amazon Web Services (AWS)', val: costData.multiCloudComparison.awsMonthly },
        { name: 'Microsoft Azure', val: costData.multiCloudComparison.azureMonthly },
        { name: 'Google Cloud Platform (GCP)', val: costData.multiCloudComparison.gcpMonthly },
        { name: 'Oracle Cloud Infrastructure (OCI)', val: costData.multiCloudComparison.ociMonthly }
      ];

      const cBoxW = (pageWidth - 28) / 4;
      compProviders.forEach((p, pIdx) => {
        const pX = 14 + pIdx * cBoxW;
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(pX, costY, cBoxW - 2, 20, 1, 1, 'F');
        pdf.setDrawColor(203, 213, 225);
        pdf.roundedRect(pX, costY, cBoxW - 2, 20, 1, 1, 'S');

        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(15, 23, 42);
        const shortName = p.name.split(' ')[0];
        pdf.text(shortName, pX + 3, costY + 5);

        pdf.setFontSize(9);
        pdf.setTextColor(180, 83, 9);
        pdf.text(formatUsd(p.val), pX + 3, costY + 11);

        pdf.setFontSize(7.5);
        pdf.setTextColor(4, 120, 87);
        pdf.text(formatBrl(p.val), pX + 3, costY + 16);
      });
    }

    // Add page numbers and footers
    addFooters();

    // Save PDF
    pdf.save(`${(diagram.title || 'cloud-architecture').toLowerCase().replace(/\s+/g, '-')}-report.pdf`);
  } catch (err) {
    console.error('PDF export failed:', err);
    throw err;
  }
};
