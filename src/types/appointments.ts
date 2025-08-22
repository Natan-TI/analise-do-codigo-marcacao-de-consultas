/**
 * types/appointments.ts
 * Responsabilidade: Tipagem do domínio de consultas.
 */
export type Appointment = {
    id: string;
    doctorId: string;
    date: string;
    time: string;
    description: string;
    status: string;
};