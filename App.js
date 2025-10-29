import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/Home';
import AddWorkerScreen from './screens/AddWorkerScreen';
import BossDashboardScreen from './screens/BossDashboardScreen';
import WorkerDashboardScreen from './screens/WorkerDashboardScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import LogHoursScreen from './screens/LogHoursScreen';
import WorkerDetailScreen from './screens/WorkerDetailScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> 
        <Stack.Screen name="Home" component={HomeScreen} /> 
        <Stack.Screen name="AddWorker" component={AddWorkerScreen} />
        <Stack.Screen name="BossDashboard" component={BossDashboardScreen}/>
        <Stack.Screen name="WorkerDashboard" component={WorkerDashboardScreen}/>
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen}/>  
        <Stack.Screen name="LogHours" component={LogHoursScreen}/> 
        <Stack.Screen name="WorkerDetail" component={WorkerDetailScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}