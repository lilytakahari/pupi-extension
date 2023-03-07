/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import DetailScreen from './components/DetailScreen';
import PuForm from './components/PuForm';
import PiForm from './components/PiForm';

import React, { useState } from 'react';
// import type {PropsWithChildren} from 'react';
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
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// Navigation Libraries
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Modal/Form
import Modal from "react-native-modal"; // not used
import DatePicker from 'react-native-date-picker'
import DateTimePickerModal from "react-native-modal-datetime-picker"; //not used
import moment from 'moment'; //not used
import NumericInput from 'react-native-numeric-input'
import DropDownPicker from 'react-native-dropdown-picker';

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
        <View>
            <Text>Pupi</Text>
        </View>
    );
}


const Stack = createNativeStackNavigator();

/* App()
 * Description: Main app function
 *
 */
export default function App() {
  return (
    <NavigationContainer>
          <Stack.Navigator>
          <Stack.Group>
            <Stack.Screen
              name="Detail"
              component={DetailScreen}
              options={({ navigation }) => ({
                headerTitle: (props) => <LogoTitle {...props} />,
                headerRight: () => (
                  /*TODO: add icon*/
                  <View style={{ flexDirection:"row" }}>
                  <Button
                    onPress={() => navigation.navigate('Pi_Add')}
                    title="Pi_A"
                    color="#cc00cc"
                  />
                  <Button
                    onPress={() => navigation.navigate('Pu_Add')}
                    title="Pu_A"
                    color="#cc00cc"
                  />
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
});
