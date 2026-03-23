import { VehicleProvider } from './src/context/VehicleContext';
import { MetricsProvider } from './src/context/MetricsContext';
import { ChecklistProvider } from './src/context/ChecklistContext';
import { DocumentProvider } from './src/context/DocumentContext';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { Platform, UIManager, LayoutAnimation } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <VehicleProvider>
            <MetricsProvider>
              <ChecklistProvider>
                <DocumentProvider>
                  <StatusBar style="auto" />
                  <AppNavigator />
                </DocumentProvider>
              </ChecklistProvider>
            </MetricsProvider>
          </VehicleProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
