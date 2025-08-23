/**
 * components/AppointmentActionModal.tsx
 * Responsabilidade: Modal de ação sobre consultas (confirmar ou cancelar).
 * Fluxo: abre modal → exibe detalhes da consulta → permite confirmar ou cancelar (com motivo opcional).
 * Por quê: centraliza a lógica de confirmação/cancelamento em um componente reutilizável.
 */

import React from 'react';
import styled from 'styled-components/native';
import { Modal, ViewStyle } from 'react-native';
import { Button, Input } from 'react-native-elements';
import theme from '../styles/theme';

// Tipagem das props do modal
interface AppointmentActionModalProps {
  visible: boolean;                    // Controle de visibilidade do modal
  onClose: () => void;                 // Callback ao fechar
  onConfirm: (reason?: string) => void;// Callback ao confirmar, com motivo opcional
  actionType: 'confirm' | 'cancel';    // Tipo da ação: confirmar ou cancelar
  appointmentDetails: {                // Detalhes da consulta exibidos no modal
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    specialty: string;
  };
}

// ===== Componente principal =====
const AppointmentActionModal: React.FC<AppointmentActionModalProps> = ({
  visible,
  onClose,
  onConfirm,
  actionType,
  appointmentDetails,
}) => {
  // Estado para armazenar o motivo do cancelamento
  const [reason, setReason] = React.useState('');

  // Confirma ação: envia callback e reseta motivo
  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
    setReason('');
    onClose();
  };

  // Fecha modal e limpa campo
  const handleClose = () => {
    setReason('');
    onClose();
  };

  // Flag: verifica se a ação é cancelamento
  const isCancel = actionType === 'cancel';

  // Renderização do modal
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Overlay>
        <ModalContainer>
          <Header>
            <Title>
              {isCancel ? 'Cancelar Consulta' : 'Confirmar Consulta'}
            </Title>
          </Header>

          <Content>
            {/* Exibe informações da consulta */}
            <AppointmentInfo>
              <InfoRow>
                <InfoLabel>Paciente:</InfoLabel>
                <InfoValue>{appointmentDetails.patientName}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Médico:</InfoLabel>
                <InfoValue>{appointmentDetails.doctorName}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Especialidade:</InfoLabel>
                <InfoValue>{appointmentDetails.specialty}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Data/Hora:</InfoLabel>
                <InfoValue>{appointmentDetails.date} às {appointmentDetails.time}</InfoValue>
              </InfoRow>
            </AppointmentInfo>

            {/* Campo de motivo só aparece se a ação for cancelar */}
            {isCancel && (
              <ReasonContainer>
                <Input
                  label="Motivo do cancelamento (opcional)"
                  placeholder="Digite o motivo..."
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={3}
                  containerStyle={styles.reasonInput}
                />
              </ReasonContainer>
            )}

            {/* Mensagem de confirmação */}
            <ConfirmationText isCancel={isCancel}>
              {isCancel 
                ? 'Tem certeza que deseja cancelar esta consulta?'
                : 'Tem certeza que deseja confirmar esta consulta?'
              }
            </ConfirmationText>
          </Content>

          {/* Botões de ação */}
          <ButtonContainer>
            <Button
              title="Cancelar"
              onPress={handleClose}
              containerStyle={styles.cancelButton as ViewStyle}
              buttonStyle={styles.cancelButtonStyle}
            />
            <Button
              title={isCancel ? 'Confirmar Cancelamento' : 'Confirmar'}
              onPress={handleConfirm}
              containerStyle={styles.confirmButton as ViewStyle}
              buttonStyle={[
                styles.confirmButtonStyle,
                { backgroundColor: isCancel ? theme.colors.error : theme.colors.success }
              ]}
            />
          </ButtonContainer>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

// ===== Estilos adicionais para inputs e botões =====
const styles = {
  reasonInput: {
    marginBottom: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
  cancelButtonStyle: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  confirmButtonStyle: {
    paddingVertical: 12,
  },
};

// ===== Styled-components para estrutura visual =====
const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const Header = styled.View`
  padding: 20px 20px 10px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  text-align: center;
`;

const Content = styled.View`
  padding: 20px;
`;

const AppointmentInfo = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 400;
  flex: 1;
  text-align: right;
`;

const ReasonContainer = styled.View`
  margin-bottom: 16px;
`;

const ConfirmationText = styled.Text<{ isCancel: boolean }>`
  font-size: 16px;
  color: ${(props: { isCancel: boolean }) => props.isCancel ? theme.colors.error : theme.colors.success};
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  padding: 0 20px 20px 20px;
`;

export default AppointmentActionModal;
