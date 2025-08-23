// services/statistics.ts
// Serviço responsável por calcular estatísticas gerais, de médicos e de pacientes.
// Usa os dados de consultas salvos no AsyncStorage para gerar métricas, como:
// total de consultas, status (pendente/confirmada/cancelada), pacientes únicos,
// médicos únicos, especialidades mais acessadas e distribuição por mês.

import AsyncStorage from '@react-native-async-storage/async-storage';

// Estrutura básica de uma consulta
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;   // formato esperado: DD/MM/AAAA
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// Estrutura completa de estatísticas retornadas pelo serviço
export interface Statistics {
  totalAppointments: number;             // Total de consultas
  confirmedAppointments: number;         // Quantidade confirmadas
  pendingAppointments: number;           // Quantidade pendentes
  cancelledAppointments: number;         // Quantidade canceladas
  totalPatients: number;                 // Pacientes únicos
  totalDoctors: number;                  // Médicos únicos
  specialties: { [key: string]: number };// Contagem por especialidade
  appointmentsByMonth: { [key: string]: number }; // Consultas agrupadas por mês/ano
  statusPercentages: {                   // Percentual por status
    confirmed: number;
    pending: number;
    cancelled: number;
  };
}

export const statisticsService = {
  // Estatísticas globais (todas as consultas e todos os usuários)
  async getGeneralStatistics(): Promise<Statistics> {
    try {
      // Recupera consultas
      const appointmentsData = await AsyncStorage.getItem('@MedicalApp:appointments');
      const appointments: Appointment[] = appointmentsData ? JSON.parse(appointmentsData) : [];
      
      // Recupera usuários registrados (não usado em cálculos aqui, mas disponível)
      const registeredUsersData = await AsyncStorage.getItem('@MedicalApp:registeredUsers');
      const registeredUsers = registeredUsersData ? JSON.parse(registeredUsersData) : [];

      // Totais por status
      const totalAppointments = appointments.length;
      const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
      const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
      const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;

      // Pacientes únicos
      const uniquePatients = new Set(appointments.map(a => a.patientId));
      const totalPatients = uniquePatients.size;

      // Médicos únicos
      const uniqueDoctors = new Set(appointments.map(a => a.doctorId));
      const totalDoctors = uniqueDoctors.size;

      // Contagem por especialidade
      const specialties: { [key: string]: number } = {};
      appointments.forEach(appointment => {
        specialties[appointment.specialty] = (specialties[appointment.specialty] || 0) + 1;
      });

      // Consultas agrupadas por mês/ano
      const appointmentsByMonth: { [key: string]: number } = {};
      appointments.forEach(appointment => {
        try {
          const [day, month, year] = appointment.date.split('/');
          const monthKey = `${month}/${year}`; // chave no formato MM/AAAA
          appointmentsByMonth[monthKey] = (appointmentsByMonth[monthKey] || 0) + 1;
        } catch (error) {
          console.warn('Data inválida encontrada:', appointment.date);
        }
      });

      // Percentuais por status (evita divisão por zero)
      const statusPercentages = {
        confirmed: totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0,
        pending: totalAppointments > 0 ? (pendingAppointments / totalAppointments) * 100 : 0,
        cancelled: totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0,
      };

      return {
        totalAppointments,
        confirmedAppointments,
        pendingAppointments,
        cancelledAppointments,
        totalPatients,
        totalDoctors,
        specialties,
        appointmentsByMonth,
        statusPercentages,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      throw error;
    }
  },

  // Estatísticas específicas de um médico
  async getDoctorStatistics(doctorId: string): Promise<Partial<Statistics>> {
    try {
      const appointmentsData = await AsyncStorage.getItem('@MedicalApp:appointments');
      const allAppointments: Appointment[] = appointmentsData ? JSON.parse(appointmentsData) : [];
      
      // Filtra apenas as consultas do médico
      const doctorAppointments = allAppointments.filter(a => a.doctorId === doctorId);

      const totalAppointments = doctorAppointments.length;
      const confirmedAppointments = doctorAppointments.filter(a => a.status === 'confirmed').length;
      const pendingAppointments = doctorAppointments.filter(a => a.status === 'pending').length;
      const cancelledAppointments = doctorAppointments.filter(a => a.status === 'cancelled').length;

      // Pacientes únicos atendidos pelo médico
      const uniquePatients = new Set(doctorAppointments.map(a => a.patientId));
      const totalPatients = uniquePatients.size;

      // Percentuais
      const statusPercentages = {
        confirmed: totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0,
        pending: totalAppointments > 0 ? (pendingAppointments / totalAppointments) * 100 : 0,
        cancelled: totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0,
      };

      return {
        totalAppointments,
        confirmedAppointments,
        pendingAppointments,
        cancelledAppointments,
        totalPatients,
        statusPercentages,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas do médico:', error);
      throw error;
    }
  },

  // Estatísticas específicas de um paciente
  async getPatientStatistics(patientId: string): Promise<Partial<Statistics>> {
    try {
      const appointmentsData = await AsyncStorage.getItem('@MedicalApp:appointments');
      const allAppointments: Appointment[] = appointmentsData ? JSON.parse(appointmentsData) : [];
      
      // Filtra apenas as consultas do paciente
      const patientAppointments = allAppointments.filter(a => a.patientId === patientId);

      const totalAppointments = patientAppointments.length;
      const confirmedAppointments = patientAppointments.filter(a => a.status === 'confirmed').length;
      const pendingAppointments = patientAppointments.filter(a => a.status === 'pending').length;
      const cancelledAppointments = patientAppointments.filter(a => a.status === 'cancelled').length;

      // Contagem por especialidade (consultas feitas pelo paciente)
      const specialties: { [key: string]: number } = {};
      patientAppointments.forEach(appointment => {
        specialties[appointment.specialty] = (specialties[appointment.specialty] || 0) + 1;
      });

      // Médicos únicos que atenderam o paciente
      const uniqueDoctors = new Set(patientAppointments.map(a => a.doctorId));
      const totalDoctors = uniqueDoctors.size;

      // Percentuais
      const statusPercentages = {
        confirmed: totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0,
        pending: totalAppointments > 0 ? (pendingAppointments / totalAppointments) * 100 : 0,
        cancelled: totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0,
      };

      return {
        totalAppointments,
        confirmedAppointments,
        pendingAppointments,
        cancelledAppointments,
        totalDoctors,
        specialties,
        statusPercentages,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas do paciente:', error);
      throw error;
    }
  },
};
