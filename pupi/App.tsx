/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
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

// Modal, for popup form
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker';

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
// fix: no entry, no loading sign
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
/*TODO: add app logo, maybe in the center */
function LogoTitle(): JSX.Element {
    return (
        <View>
            <Text>Pupi</Text>
        </View>
    );
}

/* ModalScreen()
 * Description: The form for users to input their pupi record
 * stool shape chart: https://www.webmd.com/digestive-disorders/poop-chart-bristol-stool-scale
 */
/*TODO: input form */
// need add button, textinput, datetimepicker, dropdownpicker
// implement local storage
// https://www.youtube.com/watch?v=D4dDN4nXSns
// passing data between screens in navigation
// add icon in dropdown menu: https://blog.consisty.com/react-native/dropdown_with_images/
function ModalScreen(): JSX.Element {
    //datetimepicker
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };

    const handleConfirm = (datetime) => {
      //console.warn("A date has been picked: ", datetime);
      hideDatePicker();
    };

    //dropdownpicker
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'Separate hard', value: 'pu_shape1'},
        {label: 'Italy', value: 'pu_shape2'},
        {label: 'Italy', value: 'pu_shape3'},
        {label: 'Italy', value: 'pu_shape4'},
        {label: 'Italy', value: 'pu_shape5'},
        {label: 'Italy', value: 'pu_shape6'},
        {label: 'Italy', value: 'pu_shape7'}
    ]);

    return (
        <View>
            <Text>This is a modal!</Text>
            <Button title="Show Datetime Picker" onPress={showDatePicker} />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
            />

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
                  /*TODO: add icon*/
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
