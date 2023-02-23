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

// Modal/Form
import Modal from "react-native-modal"; // not used
import DatePicker from 'react-native-date-picker'
import DateTimePickerModal from "react-native-modal-datetime-picker"; //not used
import moment from 'moment'; //not used
import NumericInput from 'react-native-numeric-input'
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

    const [date, setDate] = useState(new Date())
    /*
    const [selectedDate, setSelectedDate] = useState();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (datetime) => {
        setSelectedDate(datetime);
        hideDatePicker();
    };
    */
    /* // Another way to show date and time picker
    <Text>{`Date:  ${selectedDate? moment(selectedDate).format("MM/DD/YYYY"):"Please select date"}`}</Text>
    <Button title="Select Time" onPress={showDatePicker} />
    <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
    */
    // duration
    const [DurationValue, setDurationValue] = useState(5);

    //dropdownpicker
    const [ShapeOpen, setShapeOpen] = useState(false);
    const onShapeOpen = () => {setColorOpen(false);};
    const [ShapeValue, setShapeValue] = useState('pu_shape3');
    const [ShapeItems, setShapeItems] = useState([
        {label: 'Constipation Stool: Separate hard lumps', value: 'pu_shape1'},
        {label: 'Constipation Stool: Sausage-shaped but firm and lumpy', value: 'pu_shape2'},
        {label: 'Normal Stool: Thicker bust soft, with cracks on the surface', value: 'pu_shape3'},
        {label: 'Normal Stool: Smooth, soft, uniform', value: 'pu_shape4'},
        {label: 'Stool Lacks Fiber: Soft blobs with clear-cut edges', value: 'pu_shape5'},
        {label: 'Diarrhea Stool: Fluffy, mushy consistency with ragged edges', value: 'pu_shape6'},
        {label: 'Diarrhea Stool: Watery, liquid with no solid pieces', value: 'pu_shape7'}
    ]);

    const [ColorOpen, setColorOpen] = useState(false);
    const onColorOpen = () => {setShapeOpen(false);};
    const [ColorValue, setColorValue] = useState('pu_color3');
    const [ColorItems, setColorItems] = useState([
        {label: 'Black', value: 'pu_color1'},
        {label: 'Dark Brown', value: 'pu_color2'},
        {label: 'Brown', value: 'pu_color3'},
        {label: 'Light Brown', value: 'pu_color4'},
        {label: 'Green', value: 'pu_color5'},
    ]);

    //textinput
    const [Textvalue, onChangeText] = React.useState(null);
    return (
        <View>

            <Text>Time</Text>
            <DatePicker date={date} onDateChange={setDate} />

            <Text>Duration</Text>
            <Text><NumericInput
                minValue = {0}
                value={DurationValue}
                onChange={setDurationValue}
            />
            <Text>minutes</Text></Text>

            <Text>Shape</Text>
            <DropDownPicker
                open={ShapeOpen}
                onOpen={onShapeOpen}
                value={ShapeValue}
                items={ShapeItems}
                setOpen={setShapeOpen}
                setValue={setShapeValue}
                setItems={setShapeItems}
                dropDownDirection={"AUTO"}
            />

            <Text>Shape</Text>
            <DropDownPicker
                open={ColorOpen}
                onOpen={onColorOpen}
                value={ColorValue}
                items={ColorItems}
                setOpen={setColorOpen}
                setValue={setColorValue}
                setItems={setColorItems}
                dropDownDirection={"AUTO"}
            />
            <Text>Side Note</Text>
            <TextInput
                editable
                multiline
                numberOfLines={2}
                maxLength={40}
                onChangeText={text => onChangeText(text)}
                value={Textvalue}
                placeholder="Side note about pu"
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
