/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import DetailScreen from './components/DetailScreen';
import AnalysisScreen from './components/AnalysisScreen';
import PuForm from './components/PuForm';
import PiForm from './components/PiForm';

import React, { useState, useEffect } from 'react';

import {
  Button,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Image
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// Navigation Libraries
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Session} from './models/Session';
import {SessionRealmContext} from './models';

const {useRealm, useQuery, useObject} = SessionRealmContext;

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;



/* LogoTitle()
 * Description: The logo part of the navigation bar (header).
 *
 */
/*TODO: add app logo, maybe in the center */
function LogoTitle() {
    return (
        <View style={{ flexDirection:"row", alignItems:"center" }}>
            <Text style={{ fontSize:25, fontFamily:"sans-serif-medium", }}>PUPI</Text>
        </View>
    );
}

function Home() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false,
                                    "tabBarShowLabel": false,
                                    "tabBarStyle": [
                                    {
                                        "display": "flex"
                                    },
                                    null
                                    ]
                                 }}>
      <Tab.Screen
        name="Calendar"
        component={DetailScreen}
        options={{
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="calendar" color={color} size={size} />
            ),
        }}
      />
      <Tab.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="bar-chart" color={color} size={size} />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

/* App()
 * Description: Main app function
 *
 */
export default function App() {
  const realm = useRealm();
  useEffect(() => {
    
  
    const demo_data = require('./assets/pupi_demo_data.json')
    for (i = 0; i < demo_data.length; i++) {
      
      realm.write(() => {
        return new Session(realm, demo_data[i]);
      });
    }
    console.log(demo_data.length)
  }, []);
  
  return (
    <NavigationContainer>
          <Stack.Navigator>
          <Stack.Group>
            <Stack.Screen
              name="Home"
              component={Home}
              options={({ navigation }) => ({
                headerTitle: (props) => <LogoTitle {...props} />,
                headerRight: () => (
                  <View style={{ flexDirection:"row" }}>
                  <TouchableOpacity onPress={() => navigation.navigate('Pi_Add')}>
                      <Image
                        source={require('./assets/drop.png')}
                                style={styles.headerIcon}
                      />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Pu_Add')}>
                      <Image
                        source={require('./assets/poop.png')}
                        style={styles.headerIcon}
                      />
                  </TouchableOpacity>
                  </View>
                ),
              })}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Pu_Add" component={PuForm} />
            <Stack.Screen name="Pi_Add" component={PiForm} />
          </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  headerIcon: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
});
