import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { User } from '../types';
import { useToast } from '../hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, setIsLoading: (loading: boolean) => void) => Promise<boolean>;
  register: (name: string, email: string, password: string, whatsapp: string, setIsLoading: (loading: boolean) => void) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_URL = import.meta.env.VITE_API_URL;

// ---- INÍCIO DO CÓDIGO DE DEBUG ----
console.log("API_URL Carregada:", API_URL);

if (!API_URL) {
  console.error("ERRO CRÍTICO: A variável de ambiente VITE_API_URL não está definida!");
  // Em um app real, poderíamos mostrar uma mensagem de erro para o usuário aqui
}
// ---- FIM DO CÓDIGO DE DEBUG ----

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const { toast } = useToast();

  // Salva o usuário no localStorage sempre que mudar
  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  };

  const login = async (email: string, password: string, setIsLoading: (loading: boolean) => void): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      
      if (response.status === 200 && response.data.user) {
        setUser({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          whatsapp: response.data.user.whatsapp
        });
        toast({
          title: "Sucesso!",
          description: "Login realizado com sucesso.",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: "Erro",
        description: "Email ou senha incorretos.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, whatsapp: string, setIsLoading: (loading: boolean) => void): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        whatsapp,
      });

      if (response.status === 201) {
        toast({
          title: "Sucesso!",
          description: "Sua conta foi criada com sucesso.",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no registro:', error);
      toast({
        title: "Erro no Cadastro",
        description: "Não foi possível criar a conta. Verifique os dados ou tente um email diferente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
