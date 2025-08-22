/**
 * screens/ProfileScreen.tsx
 * Responsabilidade: Exibir informações do usuário e navegação de retorno.
 */

//IMPORTS

// Imports: Tipagem para navegação (Stack)
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Imports: React para componente funcional
import React from 'react';

// Imports: Botão estilizado pronto para uso
import { Button } from 'react-native-elements';

// Imports: Estilização com tema
import styled from 'styled-components/native';

// Imports: Cabeçalho padrão reutilizável
import { HeaderContainer, HeaderTitle } from '../components/Header';

// Imports: Tema visual padronizado
import theme from '../styles/theme';


// ====== TIPAGEM DAS ROTAS ======
type RootStackParamList = {
    Home: undefined;
    CreateAppointment: undefined;
    Profile: undefined;
};


// ====== TIPAGEM DAS PROPS DA TELA ======
type ProfileScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

// ====== COMPONENTE PRINCIPAL ======
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
// Render: estrutura visual do componente
    return (
        <Container>
            <HeaderContainer>
                <HeaderTitle>Meu Perfil</HeaderTitle>
            </HeaderContainer>

            <Content>
                <Button
                    title="Voltar"
                    icon={{
                        name: 'arrow-left',
                        type: 'font-awesome',
                        size: 20,
                        color: 'white'
                    }}
                    buttonStyle={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 20
                    }}
                    onPress={() => navigation.goBack()}
                />

                <ProfileInfo>
                    <Avatar source={{ uri: 'https://via.placeholder.com/150' }} />
                    <Name>Nome do Usuário</Name>
                    <Email>usuario@email.com</Email>
                </ProfileInfo>
            </Content>
        </Container>
    );
};

// ====== ESTILOS (styled-components) ======

// Estilo: Container
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

// Estilo: Conteúdo
const Content = styled.View`
  flex: 1;
  padding: ${theme.spacing.medium}px;
`;

// Estilo: Informações do perfil
const ProfileInfo = styled.View`
  align-items: center;
  margin-top: ${theme.spacing.large}px;
`;

// Estilo: Avatar
const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: ${theme.spacing.medium}px;
`;

// Estilo: Nome
const Name = styled.Text`
  font-size: ${theme.typography.title.fontSize}px;
  font-weight: ${theme.typography.title.fontWeight};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.small}px;
`;

// Estilo: Email
const Email = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
`;

export default ProfileScreen;