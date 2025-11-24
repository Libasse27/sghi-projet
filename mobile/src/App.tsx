import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@rneui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store, persistor } from './store';
import RootNavigator from './navigation/RootNavigator';
import theme from './styles/theme';
import SplashScreen from './screens/SplashScreen';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<SplashScreen />} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <NavigationContainer>
              <StatusBar barStyle="light-content" backgroundColor="#2C7A7B" />
              <RootNavigator />
            </NavigationContainer>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
