import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Todo from './components/Todo';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Products from './components/Products';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
     <NavigationContainer>
      <SafeAreaProvider>    
        <View style={styles.container}>
         



            <Stack.Navigator >
              <Stack.Screen options={{headerShown: false}} name="Home"component={Todo} />
              <Stack.Screen name="Products" component={Products} options={{ title: 'Back' }}/>
            </Stack.Navigator>



            
          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
     </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10
  },
});