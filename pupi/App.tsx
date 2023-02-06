/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Text,
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

// Modal, for popup form
import Modal from "react-native-modal";

// Calendar
import {Calendar, Agenda} from 'react-native-calendars'

type SectionProps = PropsWithChildren<{
  title: string;
}>;

/* DetailScreen()
 * Description: Shows detailed record of your pupi.
 *
 */
/*TODO: implement loading data, and display format*/
// fix: if no entry, no loading sign
function DetailScreen(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
          <Agenda
            selected="2023-02-08"
            items={{
              '2023-02-01': [{start:'10:00am' , duration:'2mins', shape: 'Type 1'},
                             {start:'3:00pm' , duration:'2mins', shape: 'Type 2'}],
              '2023-02-02': [{start:'3:00pm' , duration:'5mins', shape: 'Type 2'}]
            }}
            renderItem={(item, isFirst) => (
              <TouchableOpacity style={styles.item}>
                <Text style={styles.itemText}>{item.start}</Text>
                <Text style={styles.itemText}>{item.duration}</Text>
                <Text style={styles.itemText}>{item.shape}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
  );
}

/* LogoTitle()
 * Description: The logo part of the navigation bar (header).
 *
 */
/*TODO: change to app logo, maybe in the center */
function LogoTitle(): JSX.Element {
  return (
    <View>
          <Text>Pupi</Text>
    </View>
  );
}

/* ModalScreen()
 * Description: The form for users to input their pupi record
 *
 */
/*TODO: change to input form */
// need add button
// implement local storage
function ModalScreen(): JSX.Element {
  return (
    <View>
      <Text>This is a modal!</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

/* App()
 * Description: Main app function
 *
 */
export function App(): JSX.Element {
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
                  /*TODO: change to add icon*/
                  <Button
                    onPress={() => navigation.navigate('Add')}
                    title="Add"
                    color="#cc00cc"
                  />
                ),
              })}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Add" component={ModalScreen} />
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
  container: {
      flex: 1,
      justifyContent: 'center'
    },
    item: {
      backgroundColor: 'white',
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17,
    },
    itemText: {
      color: '#888',
      fontSize: 16,
    },
});

export default App;
