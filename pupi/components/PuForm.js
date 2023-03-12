import { useState } from 'react';
import {
    Button,
    Text,
    TextInput,
    View,
    StyleSheet,
    Image,
    Dimensions,
  } from 'react-native';
import DatePicker from 'react-native-date-picker';
import NumericInput from 'react-native-numeric-input';
import DropDownPicker from 'react-native-dropdown-picker';

import {Session} from '../models/Session';
import {SessionRealmContext} from '../models';

const {useRealm, useQuery, useObject} = SessionRealmContext;
const windowWidth = Dimensions.get('window').width;

/* PuForm()
 * Description: The form for users to input their pupi record
 * shape chart: https://www.webmd.com/digestive-disorders/poop-chart-bristol-stool-scale
 * color chart: https://www.buoyhealth.com/learn/what-do-stool-colors-mean
 */
// TODO: Change the format according to light mode and dark mode
// under dark mode, Date Picker's text color will be white, which make it hard to read
// TODO: The icons I used for stool shape are modified from the internet. I recommend redrawing them by yourself.
function PuForm(props) {
    const realm = useRealm();

    //datetimepicker
    const [date, setDate] = useState(new Date())

    // duration
    const [DurationValue, setDurationValue] = useState(5);

    //dropdownpicker
    const [ShapeOpen, setShapeOpen] = useState(false);
    const onShapeOpen = () => {setColorOpen(false);};
    const [ShapeValue, setShapeValue] = useState('pu_shape3');
    const [ShapeItems, setShapeItems] = useState([
        {label: 'Constipation Stool: Separate hard lumps', value: 'pu_shape1',
         icon: () => (<Image source={require('../assets/dropdownIcon/pu_shape1.png')} style={styles.dropdownIcon}/>)},
        {label: 'Constipation Stool: Sausage-shaped but firm and lumpy', value: 'pu_shape2',
         icon: () => (<Image source={require('../assets/dropdownIcon/pu_shape2.png')} style={styles.dropdownIcon}/>)},
        {label: 'Normal Stool: Thicker but soft, with cracks on the surface', value: 'pu_shape3',
         icon: () => (<Image source={require('../assets/dropdownIcon/pu_shape3.png')} style={styles.dropdownIcon}/>)},
        {label: 'Normal Stool: Smooth, soft, uniform', value: 'pu_shape4',
         icon: () => (<Image source={require('../assets/dropdownIcon/pu_shape4.png')} style={styles.dropdownIcon}/>)},
        {label: 'Stool Lacks Fiber: Soft blobs with clear-cut edges', value: 'pu_shape5',
         icon: () => (<Image source={require('../assets/dropdownIcon/pu_shape5.png')} style={styles.dropdownIcon}/>)},
        {label: 'Diarrhea Stool: Fluffy, mushy consistency with ragged edges', value: 'pu_shape6',
         icon: () => (<Image source={require('../assets/dropdownIcon/pu_shape6.png')} style={styles.dropdownIcon}/>)},
        {label: 'Diarrhea Stool: Watery, liquid with no solid pieces', value: 'pu_shape7',
         icon: () => (<Image source={require('../assets/dropdownIcon/pu_shape7.png')} style={styles.dropdownIcon}/>)},
    ]);
    const pu_shape_map = {
        'pu_shape1': 1,
        'pu_shape2': 2,
        'pu_shape3': 3,
        'pu_shape4': 4,
        'pu_shape5': 5,
        'pu_shape6': 6,
        'pu_shape7': 7,
    }

    const [ColorOpen, setColorOpen] = useState(false);
    const onColorOpen = () => {setShapeOpen(false);};
    const [ColorValue, setColorValue] = useState('pu_color2');
    const [ColorItems, setColorItems] = useState([
        {label: 'Black', value: 'pu_color1',
         icon: () => (<Image source={require('../assets/dropdownIcon/pu_color1.png')} style={styles.dropdownIcon}/>),},
        {label: 'Brown', value: 'pu_color2',
         icon: () => (<Image source={require('../assets/dropdownIcon/pu_color2.png')} style={styles.dropdownIcon}/>),},
        {label: 'Light Brown', value: 'pu_color3',
         icon: () => (<Image source={require('../assets/dropdownIcon/pu_color3.png')} style={styles.dropdownIcon}/>),},
        {label: 'Red', value: 'pu_color4',
         icon: () => (<Image source={require('../assets/dropdownIcon/pu_color4.png')} style={styles.dropdownIcon}/>),},
        {label: 'Green', value: 'pu_color5',
         icon: () => (<Image source={require('../assets/dropdownIcon/pu_color5.png')} style={styles.dropdownIcon}/>),},
        {label: 'Yellow', value: 'pu_color6',
         icon: () => (<Image source={require('../assets/dropdownIcon/pu_color6.png')} style={styles.dropdownIcon}/>),},
    ]);
    const pu_color_map = {
        'pu_color1': 'Black',
        'pu_color2': 'Brown',
        'pu_color3': 'Light Brown',
        'pu_color4': 'Red',
        'pu_color5': 'Green',
        'pu_color6': 'Yellow',
    }

    //textinput
    const [TextValue, onChangeText] = useState('');

    // Submit
    // Handle the value passing here
    const handleSubmit = (event) => {
        //alert(TextValue);
        event.preventDefault();
        props.navigation.navigate('Home')
        // insert Realm usage here
        const new_form = {
            pupi_type: 'pu',
            timestamp: date,
            duration: DurationValue,
            stool_shape: pu_shape_map[ShapeValue],
            color: pu_color_map[ColorValue],
            notes: TextValue,
        }
        realm.write(() => {
            return new Session(realm, new_form);
        });

    }

    return (
        <View>
            <View>
            <Text style={styles.titleText}>Time</Text>
            <DatePicker date={date} onDateChange={setDate} style={styles.datepickerStye}/>
            </View>

            <View>
            <Text style={styles.titleText}>Duration</Text>
                <View style={styles.numericInputStyle}>
                    <Text><NumericInput
                        minValue = {0}
                        value={DurationValue}
                        onChange={setDurationValue}
                    />
                    <Text style={styles.itemText}>minutes</Text></Text>
                </View>
            </View>

            <View style={{zIndex: 3000}}>
            <Text style={styles.titleText}>Shape</Text>
            <DropDownPicker
                open={ShapeOpen}
                onOpen={onShapeOpen}
                value={ShapeValue}
                items={ShapeItems}
                setOpen={setShapeOpen}
                setValue={setShapeValue}
                setItems={setShapeItems}
                dropDownDirection={"AUTO"}
                listMode="MODAL"
                dropDownContainerStyle={{ backgroundColor: 'white',zIndex: 3000, elevation: 3000 }}
            />
            </View>

            <View style={{zIndex: 2000}}>
            <Text style={styles.titleText}>Color</Text>
            <DropDownPicker
                open={ColorOpen}
                onOpen={onColorOpen}
                value={ColorValue}
                items={ColorItems}
                setOpen={setColorOpen}
                setValue={setColorValue}
                setItems={setColorItems}
                dropDownDirection={"AUTO"}
                listMode="MODAL"
                dropDownContainerStyle={{ backgroundColor: 'white',zIndex: 2000, elevation: 2000 }}
            />
            </View>

            <View style={{zIndex: 1000}}>
            <Text style={styles.titleText}>Side Note</Text>
            <TextInput
                editable
                multiline
                numberOfLines={3}
                maxLength={40}
                onChangeText={text => onChangeText(text)}
                value={TextValue}
                placeholder="Side note about pu"
            />
            </View>

            <View>
            <Button title="Submit" color='#00bef8' onPress={handleSubmit}  style={styles.btn}/>
            </View>
        </View>
    );
}

export default PuForm;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
  },
  itemText: {
    color: '#888',
    fontSize: 16,
  },
  btn: {
  },
  dropdownIcon: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  datepickerStye:{
    width: windowWidth
  },
  numericInputStyle:{
    alignItems: 'center'
  }
});