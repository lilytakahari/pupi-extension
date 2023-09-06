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
import ComparisonCharts from './components/ComparisonCharts';
import NotifScreen from './components/NotifScreen';
import ShareScreen from './components/ShareScreen';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

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
import {Tag} from './models/Tag';
import { Setup } from './models/Setup';
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
    <Tab.Navigator
                   screenOptions={{ headerShown: false,
                                    tabBarShowLabel: false,
                                    tabBarActiveTintColor: "#00bef8",
                                    tabBarStyle: [
                                    {
                                        display: "flex"
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
  const did_setup = useQuery(Setup);
  useEffect(() => {
    if (did_setup.length == 0) {
      PushNotificationIOS.requestPermissions();
      const demo_data = require('./assets/pupi_demo_data.json')
      for (i = 0; i < demo_data.length; i++) {
        
        realm.write(() => {
          return new Session(realm, demo_data[i]);
        });
      }
      realm.write(() => {
        return new Tag(realm, {name: 'Good hydration'});
      });
      realm.write(() => {
        return new Tag(realm, {name: 'Low hydration'});
      });
      realm.write(() => {
        return new Tag(realm, {name: 'High fiber'});
      });
      realm.write(() => {
        return new Tag(realm, {name: 'Low fiber'});
      });
      realm.write(() => {
        return new Tag(realm, {name: 'Menstruation'});
      });
      // register that we have setup to Realm
      realm.write(() => {
        return new Setup(realm, {});
      });
    }
    
    console.log("setup?");
    console.log(did_setup);
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
                  <TouchableOpacity onPress={() => navigation.navigate('Pi', {sessionId: ""})}>
                      <Image
                        source={require('./assets/drop.png')}
                                style={styles.headerIcon}
                      />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Pu', {sessionId: ""})}>
                      <Image
                        source={require('./assets/poop.png')}
                        style={styles.headerIcon}
                      />
                  </TouchableOpacity>
                  </View>
                ),
                headerLeft: () => (
                  <View style={{ flexDirection:"row", alignItems: 'center'}}>
                  <TouchableOpacity onPress={() => navigation.navigate('Export Data', {sessionId: ""})}>
                    <Ionicons name="share" color={'black'} size={30} style={{marginRight: 5}}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Reminders', {sessionId: ""})}>
                    <Ionicons name="notifications" color={'black'} size={28}/>
                  </TouchableOpacity>
                  </View>
                ),
              })}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal', headerTitle: false, }}>
            <Stack.Screen name="Pu" component={PuForm} />
            <Stack.Screen name="Pi" component={PiForm} />
            <Stack.Screen name="Comparison" component={ComparisonCharts} />
            <Stack.Screen name="Reminders" component={NotifScreen} />
            <Stack.Screen name="Export Data" component={ShareScreen} />
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
