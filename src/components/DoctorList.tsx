/**
 * components/DoctorList.tsx
 * Responsabilidade: Renderizar uma lista de médicos para seleção.
 * Fluxo: recebe array de médicos → renderiza cada um como ListItem com avatar e especialidade → 
 * ao clicar chama callback onSelectDoctor passando o médico selecionado.
 * Por quê: facilita a escolha do médico de forma visual e padronizada.
 */

import React from 'react';
import styled from 'styled-components/native';
import { ViewStyle } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import theme from '../styles/theme';

// ===== Tipagem interna do componente =====
interface Doctor {
  id: string;        // Identificador único do médico
  name: string;      // Nome do médico
  specialty: string; // Especialidade médica
  image: string;     // URL da foto do médico
}

// ===== Props do componente DoctorList =====
interface DoctorListProps {
  doctors: Doctor[];                             // Lista de médicos a ser exibida
  onSelectDoctor: (doctor: Doctor) => void;      // Callback chamado ao selecionar um médico
  selectedDoctorId?: string;                     // Id do médico atualmente selecionado
  style?: ViewStyle;                             // Estilo adicional opcional para o container
}

// ===== Componente principal =====
const DoctorList: React.FC<DoctorListProps> = ({
  doctors,
  onSelectDoctor,
  selectedDoctorId,
  style,
}) => {
  return (
    <Container style={style}>
      {doctors.map((doctor) => (
        <ListItem
          key={doctor.id}
          onPress={() => onSelectDoctor(doctor)} // Ao clicar, dispara callback com o médico
          containerStyle={[
            styles.listItem,
            selectedDoctorId === doctor.id && styles.selectedItem, // Aplica estilo se for selecionado
          ]}
        >
          {/* Avatar do médico */}
          <Avatar
            size="medium"
            rounded
            source={{ uri: doctor.image }}
            containerStyle={styles.avatar}
          />

          {/* Nome e especialidade */}
          <ListItem.Content>
            <ListItem.Title style={styles.name}>{doctor.name}</ListItem.Title>
            <ListItem.Subtitle style={styles.specialty}>
              {doctor.specialty}
            </ListItem.Subtitle>
          </ListItem.Content>

          {/* Ícone de navegação (seta) */}
          <ListItem.Chevron />
        </ListItem>
      ))}
    </Container>
  );
};

// ===== Estilos adicionais =====
const styles = {
  listItem: {
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedItem: {
    backgroundColor: theme.colors.primary + '20', // Cor de fundo transparente quando selecionado
    borderColor: theme.colors.primary,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  specialty: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
  },
};

// ===== Styled-components =====
const Container = styled.View`
  margin-bottom: 15px;
`;

export default DoctorList;
