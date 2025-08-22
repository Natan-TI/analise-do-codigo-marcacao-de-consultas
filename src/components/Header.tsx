/**
 * components/Header.tsx
 * Responsabilidade: Cabeçalho reutilizável com cor primária e título.
 * Por quê: padroniza a barra superior do app.
 */

//IMPORTS

// Imports: StatusBar para ajustar o padding no topo
import { StatusBar } from 'react-native';

// Imports: Estilização usando styled-components
import styled from 'styled-components/native';

// Imports: Tema centralizado (cores, tipografia, espaçamentos)
import theme from '../styles/theme';

// ====== CONTAINER DO HEADER ======
// Área principal do cabeçalho: cor de fundo primária, padding interno, sombra e elevação
// Ajusta espaçamento superior de acordo com a altura da status bar
export const HeaderContainer = styled.View`
  background-color: ${theme.colors.primary};
  padding-top: ${StatusBar.currentHeight}px;
  padding: ${theme.spacing.medium}px;
  elevation: 4;
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
`;

// ====== TÍTULO DO HEADER ======
// Texto exibido no cabeçalho com tipografia definida no tema
export const HeaderTitle = styled.Text`
  color: ${theme.colors.white};
  font-size: ${theme.typography.title.fontSize}px;
  font-weight: ${theme.typography.title.fontWeight};
`;