// services/notifications.ts
// Serviço responsável por gerenciar notificações da aplicação usando AsyncStorage.
// Oferece operações de CRUD: listar por usuário, criar, marcar como lidas (uma ou todas),
// excluir e obter contagem de não lidas. Também expõe helpers para eventos do sistema
// (consulta confirmada/cancelada, novo agendamento e lembrete).

import AsyncStorage from '@react-native-async-storage/async-storage';

// Estrutura de uma notificação persistida
export interface Notification {
  id: string;                       // Identificador único da notificação
  userId: string;                   // Usuário destinatário
  title: string;                    // Título exibido
  message: string;                  // Mensagem descritiva
  type: 'appointment_confirmed' | 'appointment_cancelled' | 'appointment_reminder' | 'general'; // Categoria
  read: boolean;                    // Indicador de leitura
  createdAt: string;                // Timestamp ISO de criação
  appointmentId?: string;           // (Opcional) ID de consulta relacionada
}

// Chave usada para persistir/recuperar notificações no AsyncStorage
const STORAGE_KEY = '@MedicalApp:notifications';

export const notificationService = {
  // Retorna as notificações de um usuário, mais recentes primeiro
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      // Filtra por usuário e ordena por data decrescente
      return allNotifications.filter(n => n.userId === userId).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      return [];
    }
  },

  // Cria uma nova notificação (completa campos calculados: id, createdAt e read=false)
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),       // Usa timestamp como id simples
        createdAt: new Date().toISOString(),
        read: false,
      };

      allNotifications.push(newNotification);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allNotifications));
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  },

  // Marca uma notificação específica como lida
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      const updatedNotifications = allNotifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  },

  // Marca todas as notificações de um usuário como lidas
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      const updatedNotifications = allNotifications.map(n => 
        n.userId === userId ? { ...n, read: true } : n
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
    }
  },

  // Exclui uma notificação pelo id
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      const filteredNotifications = allNotifications.filter(n => n.id !== notificationId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotifications));
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  },

  // Retorna a quantidade de notificações não lidas de um usuário
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const notifications = await this.getNotifications(userId);
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Erro ao contar notificações não lidas:', error);
      return 0;
    }
  },

  // ==== Notificações derivadas de eventos do app ====

  // Notifica o paciente quando a consulta foi confirmada
  async notifyAppointmentConfirmed(patientId: string, appointmentDetails: any): Promise<void> {
    await this.createNotification({
      userId: patientId,
      type: 'appointment_confirmed',
      title: 'Consulta Confirmada',
      message: `Sua consulta com ${appointmentDetails.doctorName} foi confirmada para ${appointmentDetails.date} às ${appointmentDetails.time}.`,
      appointmentId: appointmentDetails.id,
    });
  },

  // Notifica o paciente quando a consulta foi cancelada (opcionalmente com motivo)
  async notifyAppointmentCancelled(patientId: string, appointmentDetails: any, reason?: string): Promise<void> {
    await this.createNotification({
      userId: patientId,
      type: 'appointment_cancelled',
      title: 'Consulta Cancelada',
      message: `Sua consulta com ${appointmentDetails.doctorName} foi cancelada.${reason ? ` Motivo: ${reason}` : ''}`,
      appointmentId: appointmentDetails.id,
    });
  },

  // Notifica o médico quando um novo agendamento é criado
  async notifyNewAppointment(doctorId: string, appointmentDetails: any): Promise<void> {
    await this.createNotification({
      userId: doctorId,
      type: 'general',
      title: 'Nova Consulta Agendada',
      message: `${appointmentDetails.patientName} agendou uma consulta para ${appointmentDetails.date} às ${appointmentDetails.time}.`,
      appointmentId: appointmentDetails.id,
    });
  },

  // Lembrete de consulta (pode ser usado para paciente ou médico, depende de userId)
  async notifyAppointmentReminder(userId: string, appointmentDetails: any): Promise<void> {
    await this.createNotification({
      userId: userId,
      type: 'appointment_reminder',
      title: 'Lembrete de Consulta',
      message: `Você tem uma consulta agendada para amanhã às ${appointmentDetails.time} com ${appointmentDetails.doctorName || appointmentDetails.patientName}.`,
      appointmentId: appointmentDetails.id,
    });
  },
};
