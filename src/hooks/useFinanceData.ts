import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

interface FinanceData {
  entradas: number;
  saidas: number;
  saldo: number;
}

interface UseFinanceDataReturn {
  financeData: FinanceData;
  isLoading: boolean;
  error: string | null;
  fetchFinanceData: () => void;
}

export const useFinanceData = (): UseFinanceDataReturn => {
  const { user } = useAuth();
  const [financeData, setFinanceData] = useState<FinanceData>({ entradas: 0, saidas: 0, saldo: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFinanceData = useCallback(async () => {
    if (!user || !user.whatsapp) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/finance/saldo/${user.whatsapp}`);
      setFinanceData(response.data);
    } catch (err) {
      setError('Falha ao buscar dados financeiros.');
      console.error(err);
      setFinanceData({ entradas: 0, saidas: 0, saldo: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  return { financeData, isLoading, error, fetchFinanceData };
};

// /-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/
//
//   RESPONSABILIDADE:
//   - Gerencia a busca e o estado dos dados financeiros principais (saldo, entradas, saídas).
//
//   CONECTA-SE COM:
//   - API Backend: /api/finance/saldo/:usuarioId
//   - Contexto: useAuth para obter o ID do usuário (whatsapp).
//   - Componentes: Dashboard.tsx
//
// /-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/ 