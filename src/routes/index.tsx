/**
 * routes/index.tsx
 * Responsabilidade: Definir rotas principais do app usando Stack Navigator.
 * Por quê: centraliza navegação entre Home, CreateAppointment e Profile.
 */

//IMPORTS

// Imports: Importa o Stack Navigator nativo
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Imports: Tela inicial (lista de consultas)
import HomeScreen from '../screens/HomeScreen';

// Imports: Tela para criar novo agendamento
import CreateAppointmentScreen from '../screens/CreateAppointmentScreen';

// Imports: Tela de perfil do usuário
import ProfileScreen from '../screens/ProfileScreen';


// ====== CRIAÇÃO DO STACK ======
// Cria um stack navigator que organiza as telas em pilha
const Stack = createNativeStackNavigator();

// ====== COMPONENTE DE ROTAS PRINCIPAIS ======
// Retorna o conjunto de rotas que serão usadas no app
export default function AppRoutes() {
// Render: estrutura visual do componente
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateAppointment" component={CreateAppointmentScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}