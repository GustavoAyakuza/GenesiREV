import React from 'react';
import { DollarSign, PiggyBank, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import AIInsights from '../components/AIInsights';
import { useFinanceData } from '../hooks/useFinanceData';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { financeData, isLoading, error } = useFinanceData();

  // 1. Se houver um erro, exibe uma mensagem clara.
  if (error) {
    return <div className="text-red-500 text-center p-8">Erro ao carregar dados: {error}</div>;
  }

  // 2. Se estiver carregando ou se os dados ainda não chegaram, exibe uma tela de "esqueleto".
  // Isso previne 100% dos erros de "cannot read property of undefined".
  if (isLoading || !financeData) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-9 w-72 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[126px] w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
    );
  }

  // 3. Somente se tudo deu certo, define e renderiza os dados.
  const metrics = [
    {
      title: 'Entradas',
      value: `R$ ${(financeData.entradas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: ArrowUpCircle,
      color: 'text-green-400'
    },
    {
      title: 'Saídas',
      value: `R$ ${(financeData.saidas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: ArrowDownCircle,
      color: 'text-red-400'
    },
    {
      title: 'Saldo Atual',
      value: `R$ ${(financeData.saldo || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-blue-400'
    },
    {
      title: 'Investimentos',
      value: 'R$ 0,00',
      icon: PiggyBank,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard Financeiro</h1>
          <p className="text-white/60 text-sm sm:text-base">Visão geral das suas finanças em tempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change="+0%"
            trend="up"
            icon={metric.icon}
            color={metric.color}
            delay={index * 100}
          />
        ))}
      </div>
      <AIInsights />
      <div className="genesi-card">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button className="genesi-button bg-genesi-green hover:bg-genesi-green-dark">Adicionar Receita</button>
          <button className="genesi-button bg-genesi-orange hover:bg-orange-600">Registrar Despesa</button>
          <button className="genesi-button bg-genesi-purple hover:bg-purple-600 sm:col-span-2 lg:col-span-1">Novo Investimento</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
