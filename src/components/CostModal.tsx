import React, { useState } from 'react';
import { X, DollarSign, Download, TrendingDown, RefreshCw, Coins, FileText, Code2 } from 'lucide-react';
import { DiagramState } from '../types';
import { calculateTotalCost } from '../utils/costCalculator';

interface CostModalProps {
  diagram: DiagramState;
  setDiagram?: React.Dispatch<React.SetStateAction<DiagramState>>;
  onClose: () => void;
  onExportPdf?: () => void;
  theme?: 'dark' | 'light';
}

export const CostModal: React.FC<CostModalProps> = ({ diagram, onClose, onExportPdf, theme }) => {
  const isLight = theme === 'light';
  const [currency, setCurrency] = useState<'USD' | 'BRL'>('BRL');
  const [exchangeRate, setExchangeRate] = useState<number>(5.60);

  const costReport = calculateTotalCost(diagram.nodes);

  const formatCost = (usdAmount: number): string => {
    const amount = currency === 'BRL' ? usdAmount * exchangeRate : usdAmount;
    if (currency === 'BRL') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleExportCsv = () => {
    const rate = currency === 'BRL' ? exchangeRate : 1;
    let csv = `Node ID,Node Name,Provider,Category,Service Type,Monthly Cost (${currency}),Annual Cost (${currency}),Details\n`;
    costReport.items.forEach((item) => {
      const mCost = (item.monthlyCost * rate).toFixed(2);
      const aCost = (item.annualCost * rate).toFixed(2);
      csv += `"${item.nodeId}","${item.nodeName}","${item.provider}","${item.category}","${item.serviceType}",${mCost},${aCost},"${item.details}"\n`;
    });
    const totM = (costReport.totalMonthly * rate).toFixed(2);
    const totA = (costReport.totalAnnual * rate).toFixed(2);
    csv += `\nTotal Monthly (${currency}),,,,,${totM},${totA},\n`;
    if (currency === 'BRL') {
      csv += `Câmbio Aplicado,,,,,1 USD = R$ ${exchangeRate.toFixed(2)},,\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${diagram.title.toLowerCase().replace(/\s+/g, '-')}-cost-report-${currency.toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const rate = currency === 'BRL' ? exchangeRate : 1;
    const jsonSummary = {
      architecture: {
        id: diagram.id,
        title: diagram.title || 'Untitled Architecture',
        exportedAt: new Date().toISOString(),
        currency: currency,
        exchangeRateApplied: currency === 'BRL' ? exchangeRate : 1.0,
        resourceCount: diagram.nodes.length,
        metadata: diagram.metadata || null
      },
      summary: {
        totalMonthlyCostUSD: costReport.totalMonthly,
        totalAnnualCostUSD: costReport.totalAnnual,
        totalMonthlyCostSelectedCurrency: Math.round((costReport.totalMonthly * rate) * 100) / 100,
        totalAnnualCostSelectedCurrency: Math.round((costReport.totalAnnual * rate) * 100) / 100,
        formattedMonthlyCost: formatCost(costReport.totalMonthly),
        formattedAnnualCost: formatCost(costReport.totalAnnual)
      },
      multiCloudComparison: {
        awsMonthlyCostUSD: costReport.multiCloudComparison.awsMonthly,
        azureMonthlyCostUSD: costReport.multiCloudComparison.azureMonthly,
        gcpMonthlyCostUSD: costReport.multiCloudComparison.gcpMonthly,
        ociMonthlyCostUSD: costReport.multiCloudComparison.ociMonthly,
        awsMonthlyCostSelectedCurrency: Math.round((costReport.multiCloudComparison.awsMonthly * rate) * 100) / 100,
        azureMonthlyCostSelectedCurrency: Math.round((costReport.multiCloudComparison.azureMonthly * rate) * 100) / 100,
        gcpMonthlyCostSelectedCurrency: Math.round((costReport.multiCloudComparison.gcpMonthly * rate) * 100) / 100,
        ociMonthlyCostSelectedCurrency: Math.round((costReport.multiCloudComparison.ociMonthly * rate) * 100) / 100
      },
      resources: costReport.items.map((item) => ({
        nodeId: item.nodeId,
        nodeName: item.nodeName,
        provider: item.provider,
        category: item.category,
        serviceType: item.serviceType,
        details: item.details,
        monthlyCostUSD: item.monthlyCost,
        annualCostUSD: item.annualCost,
        monthlyCostSelectedCurrency: Math.round((item.monthlyCost * rate) * 100) / 100,
        annualCostSelectedCurrency: Math.round((item.annualCost * rate) * 100) / 100,
        formattedMonthlyCost: formatCost(item.monthlyCost),
        formattedAnnualCost: formatCost(item.annualCost)
      }))
    };

    const blob = new Blob([JSON.stringify(jsonSummary, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = (diagram.title || 'architecture').toLowerCase().replace(/\s+/g, '-');
    link.download = `${safeTitle}-cost-summary-${currency.toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none ${
      isLight ? 'bg-slate-900/60' : 'bg-black/80'
    }`}>
      <div className={`border rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#12141A] border-white/10 text-slate-200'
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-black/20'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isLight ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-bold ${isLight ? 'text-slate-950' : 'text-slate-100'}`}>
                Calculadora de Custos de Nuvem
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                Estimativa e comparativo de preços multi-cloud em tempo real
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Currency Switcher */}
            <div className={`flex items-center border p-1 rounded-xl space-x-1 ${
              isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-white/5 border-white/10'
            }`}>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  currency === 'USD'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-300/60 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>USD ($)</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrency('BRL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  currency === 'BRL'
                    ? isLight
                      ? 'bg-emerald-600 text-white shadow-md font-bold'
                      : 'bg-emerald-500 text-slate-950 shadow-md'
                    : isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-300/60 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>BRL (R$)</span>
              </button>
            </div>

            {/* Exchange Rate Adjustment Input when BRL selected */}
            {currency === 'BRL' && (
              <div className={`flex items-center space-x-1.5 border px-2.5 py-1 rounded-xl text-xs ${
                isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              }`}>
                <Coins className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                <span className={`text-[11px] font-semibold ${isLight ? 'text-emerald-900' : 'text-emerald-200/80'}`}>1 USD = R$</span>
                <input
                  type="number"
                  step="0.05"
                  min="1.0"
                  max="20.0"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 5.60)}
                  className={`w-14 border rounded px-1.5 py-0.5 text-xs font-bold outline-none text-center ${
                    isLight ? 'bg-white border-emerald-400 text-emerald-950' : 'bg-black/60 border-emerald-500/40 text-emerald-300 focus:border-emerald-400'
                  }`}
                  title="Ajuste a taxa de câmbio Dólar / Real"
                />
              </div>
            )}

            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className={`flex items-center space-x-1.5 border px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                  isLight
                    ? 'bg-red-50 hover:bg-red-100 border-red-300 text-red-700'
                    : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-300'
                }`}
                title="Gerar e baixar o relatório em PDF com descrição dos componentes e custos"
              >
                <FileText className={`w-4 h-4 ${isLight ? 'text-red-600' : 'text-red-400'}`} />
                <span>Report PDF</span>
              </button>
            )}

            <button
              onClick={handleExportCsv}
              className={`flex items-center space-x-1.5 border px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
              }`}
              title="Exportar custos detalhados em planilha CSV"
            >
              <Download className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
              <span>Exportar CSV</span>
            </button>

            <button
              id="btn-export-cost-json"
              onClick={handleExportJson}
              className={`flex items-center space-x-1.5 border px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                isLight
                  ? 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-300'
              }`}
              title="Download Summary as JSON - Exporta análise de custos e lista de recursos como arquivo JSON formatado"
            >
              <Code2 className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
              <span>Exportar JSON</span>
            </button>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-md transition-colors ${
                isLight ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900' : 'hover:bg-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Executive Cost Summary Cards */}
        <div className={`p-6 border-b grid grid-cols-4 gap-4 ${
          isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-black/40 border-white/10'
        }`}>
          <div className={`border rounded-xl p-4 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}>
              {currency === 'BRL' ? 'Custo Mensal Total (R$)' : 'Total Monthly Cost (USD)'}
            </span>
            <span className={`text-2xl font-black mt-1 block ${
              isLight ? 'text-amber-600' : 'text-amber-400'
            }`}>
              {formatCost(costReport.totalMonthly)}
            </span>
            <span className={`text-[10px] block mt-0.5 ${
              isLight ? 'text-slate-600 font-medium' : 'text-slate-500'
            }`}>
              {currency === 'BRL' ? `Base 730h/mês (Câmbio R$ ${exchangeRate.toFixed(2)})` : 'Based on 730 hrs/month baseline'}
            </span>
          </div>

          <div className={`border rounded-xl p-4 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}>
              {currency === 'BRL' ? 'Projeção Anual (R$)' : 'Total Annual Projection (USD)'}
            </span>
            <span className={`text-2xl font-black mt-1 block ${
              isLight ? 'text-slate-950' : 'text-slate-100'
            }`}>
              {formatCost(costReport.totalAnnual)}
            </span>
            <span className={`text-[10px] block mt-0.5 ${
              isLight ? 'text-slate-600 font-medium' : 'text-slate-500'
            }`}>
              {currency === 'BRL' ? 'Estimativa para 12 meses' : '12-Month Committed Use'}
            </span>
          </div>

          <div className={`border rounded-xl p-4 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}>
              Total de Recursos
            </span>
            <span className={`text-2xl font-black mt-1 block ${
              isLight ? 'text-blue-700' : 'text-blue-400'
            }`}>
              {diagram.nodes.length} {diagram.nodes.length === 1 ? 'Nó' : 'Nós'}
            </span>
            <span className={`text-[10px] block mt-0.5 ${
              isLight ? 'text-slate-600 font-medium' : 'text-slate-500'
            }`}>Ativos na arquitetura</span>
          </div>

          <div className={`border rounded-xl p-4 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}>
              Provedor Mais Econômico
            </span>
            <span className={`text-2xl font-black mt-1 block ${
              isLight ? 'text-emerald-700' : 'text-emerald-400'
            }`}>
              OCI ({formatCost(costReport.multiCloudComparison.ociMonthly)}/mês)
            </span>
            <span className={`text-[10px] block mt-0.5 ${
              isLight ? 'text-emerald-700 font-medium' : 'text-emerald-500/80'
            }`}>~24% de economia estimada</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Multi-Cloud Price Comparison Bar */}
          <div className={`border rounded-2xl p-5 ${
            isLight ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-black/20 border-white/10'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              <TrendingDown className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
              <h3 className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-900' : 'text-slate-300'
              }`}>
                Comparativo de Custos Multi-Cloud ({currency === 'BRL' ? `Real Brasileiro - R$ ${exchangeRate.toFixed(2)}/USD` : 'Dólar Americano - USD'})
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
              {[
                { name: 'AWS (Amazon)', val: costReport.multiCloudComparison.awsMonthly, color: isLight ? 'border-amber-500 text-amber-600 font-extrabold' : 'border-amber-500 text-amber-400' },
                { name: 'Azure (Microsoft)', val: costReport.multiCloudComparison.azureMonthly, color: isLight ? 'border-sky-500 text-sky-600 font-extrabold' : 'border-sky-500 text-sky-400' },
                { name: 'GCP (Google Cloud)', val: costReport.multiCloudComparison.gcpMonthly, color: isLight ? 'border-emerald-500 text-emerald-600 font-extrabold' : 'border-emerald-500 text-emerald-400' },
                { name: 'OCI (Oracle Cloud)', val: costReport.multiCloudComparison.ociMonthly, color: isLight ? 'border-red-500 text-red-600 font-extrabold' : 'border-red-500 text-red-400' }
              ].map((provider) => (
                <div key={provider.name} className={`border-t-2 ${provider.color} p-3 rounded-xl border-x border-b ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
                }`}>
                  <span className={`text-xs font-bold block ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>{provider.name}</span>
                  <span className={`text-lg font-black block mt-1 ${provider.color}`}>
                    {formatCost(provider.val)} / mês
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Resource Table */}
          <div className={`border rounded-2xl p-5 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/20 border-white/10'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              isLight ? 'text-slate-950' : 'text-slate-300'
            }`}>
              Detalhamento de Recursos e Custos
            </h3>

            <div className="overflow-x-auto">
              <table className={`w-full text-left text-xs ${
                isLight ? 'text-slate-800' : 'text-slate-300'
              }`}>
                <thead className={`font-bold uppercase text-[10px] border-b ${
                  isLight ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-white/5 text-slate-400 border-white/10'
                }`}>
                  <tr>
                    <th className="p-3">Recurso</th>
                    <th className="p-3">Provedor</th>
                    <th className="p-3">Categoria</th>
                    <th className="p-3">Especificações</th>
                    <th className="p-3">Custo Mensal ({currency})</th>
                    <th className="p-3">Custo Anual ({currency})</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isLight ? 'divide-slate-200' : 'divide-white/5'
                }`}>
                  {costReport.items.map((item) => (
                    <tr key={item.nodeId} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'}>
                      <td className={`p-3 font-semibold ${isLight ? 'text-slate-950' : 'text-slate-100'}`}>{item.nodeName}</td>
                      <td className={`p-3 uppercase font-bold text-[10px] ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{item.provider}</td>
                      <td className={`p-3 uppercase text-[10px] ${isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}`}>{item.category}</td>
                      <td className={`p-3 font-mono text-[11px] ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{item.details}</td>
                      <td className={`p-3 font-bold ${isLight ? 'text-amber-600 font-extrabold' : 'text-amber-400'}`}>{formatCost(item.monthlyCost)}</td>
                      <td className={`p-3 ${isLight ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>{formatCost(item.annualCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

