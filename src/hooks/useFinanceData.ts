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
  financeData: FinanceData | null;
  isLoading: boolean;
  error: string | null;
  fetchFinanceData: () => void;
}

export const useFinanceData = (): UseFinanceDataReturn => {
  const { user } = useAuth();
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinanceData = useCallback(async () => {
    if (!user || !user.id) {
        setIsLoading(false);
        return;
    };

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/finance/saldo/${user.id}`);
      setFinanceData(response.data);
    } catch (err) {
      setError('Falha ao buscar dados financeiros.');
      console.error(err);
      setFinanceData(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchFinanceData();
    } else {
      setFinanceData(null);
      setIsLoading(false);
    }
  }, [user, fetchFinanceData]);

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