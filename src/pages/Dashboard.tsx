import React from 'react';
import { DollarSign, PiggyBank, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import AIInsights from '../components/AIInsights';
import { useFinanceData } from '../hooks/useFinanceData';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { financeData, isLoading, error } = useFinanceData();
  
  // ---- INÍCIO DO CÓDIGO DE DEBUG ----
  console.log('[Dashboard] Dados financeiros recebidos:', financeData);
  console.log('[Dashboard] Está carregando:', isLoading);
  console.log('[Dashboard] Erro:', error);
  // ---- FIM DO CÓDIGO DE DEBUG ----

  const metrics = [
    {
      title: 'Entradas',
      value: `R$ ${financeData.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: '+0%',
      trend: 'up' as const,
      icon: ArrowUpCircle,
      color: 'text-green-400'
    },
    {
      title: 'Saídas',
      value: `R$ ${financeData.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: '0%',
      trend: 'down' as const,
      icon: ArrowDownCircle,
      color: 'text-red-400'
    },
    {
      title: 'Saldo Atual',
      value: `R$ ${financeData.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: '+0%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-blue-400'
    },
    {
      title: 'Investimentos',
      value: 'R$ 0,00',
      change: '+0%',
      trend: 'up' as const,
      icon: PiggyBank,
      color: 'text-purple-400'
    }
  ];

  if (error) {
    return <div className="text-red-500 text-center">Erro ao carregar dados do dashboard: {error}</div>;
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard Financeiro</h1>
          <p className="text-white/60 text-sm sm:text-base">Visão geral das suas finanças em tempo real</p>
        </div>
        <div className="genesi-card px-3 py-2 sm:px-4 self-start sm:self-auto">
          <span className="text-xs sm:text-sm text-white/60">Última atualização: </span>
          <span className="text-white font-semibold text-xs sm:text-sm">Agora</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-[126px] w-full rounded-xl" />
            ))
          : metrics.map((metric, index) => (
              <MetricCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                trend={metric.trend}
                icon={metric.icon}
                color={metric.color}
                delay={index * 100}
              />
            ))}
      </div>

      {/* AI Insights */}
      <AIInsights />

      {/* Quick Actions */}
      <div className="genesi-card">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button className="genesi-button bg-genesi-green hover:bg-genesi-green-dark text-sm sm:text-base py-2 sm:py-3">
            Adicionar Receita
          </button>
          <button className="genesi-button bg-genesi-orange hover:bg-orange-600 text-sm sm:text-base py-2 sm:py-3">
            Registrar Despesa
          </button>
          <button className="genesi-button bg-genesi-purple hover:bg-purple-600 text-sm sm:text-base py-2 sm:py-3 sm:col-span-2 lg:col-span-1">
            Novo Investimento
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
