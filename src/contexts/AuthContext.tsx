/**
 * contexts/AuthContext.tsx
 * Responsabilidade: Gerenciar autenticação do usuário (login, cadastro, logout, persistência em AsyncStorage).
 * Fluxo: AuthProvider mantém estado global → salva e carrega dados do usuário/tokens no AsyncStorage →
 * fornece funções (signIn, register, signOut, updateUser) via contexto → useAuth permite acessar esse contexto.
 * Por quê: centraliza regras de autenticação e evita duplicação de lógica em várias telas.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth';
import { User, LoginCredentials, RegisterData, AuthContextData } from '../types/auth';

// ===== Chaves usadas no AsyncStorage =====
const STORAGE_KEYS = {
  USER: '@MedicalApp:user',   // Dados do usuário logado
  TOKEN: '@MedicalApp:token', // Token de autenticação
};

// Cria contexto com tipagem definida em AuthContextData
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// ===== Provider responsável por encapsular toda a lógica de autenticação =====
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Estado do usuário atual
  const [loading, setLoading] = useState(true);        // Controle de carregamento inicial

  // Ao montar o provider, carrega usuário salvo e lista de usuários registrados
  useEffect(() => {
    loadStoredUser();
    loadRegisteredUsers();
  }, []);

  // ===== Recupera usuário logado do AsyncStorage =====
  const loadStoredUser = async () => {
    try {
      const storedUser = await authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== Carrega lista de usuários registrados (mock/simulação de backend) =====
  const loadRegisteredUsers = async () => {
    try {
      await authService.loadRegisteredUsers();
    } catch (error) {
      console.error('Erro ao carregar usuários registrados:', error);
    }
  };

  // ===== Login: valida credenciais, salva usuário e token =====
  const signIn = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.signIn(credentials);
      setUser(response.user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    } catch (error) {
      throw error;
    }
  };

  // ===== Cadastro: cria novo usuário, salva e autentica =====
  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    } catch (error) {
      throw error;
    }
  };

  // ===== Logout: remove usuário e token =====
  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // ===== Atualiza dados do usuário no estado e persiste no AsyncStorage =====
  const updateUser = async (updatedUser: User) => {
    try {
      setUser(updatedUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  // ===== Disponibiliza dados e funções no contexto =====
  return (
    <AuthContext.Provider value={{ user, loading, signIn, register, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ===== Hook de acesso ao contexto de autenticação =====
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
