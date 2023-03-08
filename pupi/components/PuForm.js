import { useState } from 'react';
import {
    Button,
    Text,
    TextInput,
    View,
  } from 'react-native';
import DatePicker from 'react-native-date-picker';
import NumericInput from 'react-native-numeric-input';
import DropDownPicker from 'react-native-dropdown-picker';

import {Session} from '../models/Session';
import {SessionRealmContext} from '../models';


const {useRealm, useQuery, useObject} = SessionRealmContext;

/* PuForm()
 * Description: The form for users to input their pupi record
 * stool shape chart: https://www.webmd.com/digestive-disorders/poop-chart-bristol-stool-scale
 */
/*TODO: input form */
// need add button, textinput, datetimepicker, dropdownpicker
// implement local storage
// https://www.youtube.com/watch?v=D4dDN4nXSns
// passing data between screens in navigation
// add icon in dropdown menu: https://blog.consisty.com/react-native/dropdown_with_images/
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
        {label: 'Constipation Stool: Separate hard lumps', value: 'pu_shape1'},
        {label: 'Constipation Stool: Sausage-shaped but firm and lumpy', value: 'pu_shape2'},
        {label: 'Normal Stool: Thicker bust soft, with cracks on the surface', value: 'pu_shape3'},
        {label: 'Normal Stool: Smooth, soft, uniform', value: 'pu_shape4'},
        {label: 'Stool Lacks Fiber: Soft blobs with clear-cut edges', value: 'pu_shape5'},
        {label: 'Diarrhea Stool: Fluffy, mushy consistency with ragged edges', value: 'pu_shape6'},
        {label: 'Diarrhea Stool: Watery, liquid with no solid pieces', value: 'pu_shape7'}
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
    const [ColorValue, setColorValue] = useState('pu_color3');
    const [ColorItems, setColorItems] = useState([
        {label: 'Black', value: 'pu_color1'},
        {label: 'Dark Brown', value: 'pu_color2'},
        {label: 'Brown', value: 'pu_color3'},
        {label: 'Light Brown', value: 'pu_color4'},
        {label: 'Green', value: 'pu_color5'},
    ]);
    const pu_color_map = {
        'pu_color1': 'Black',
        'pu_color2': 'Dark Brown',
        'pu_color3': 'Brown',
        'pu_color4': 'Light Brown',
        'pu_color5': 'Green',
    }

    //textinput
    const [TextValue, onChangeText] = useState('');

    // Submit
    // Handle the value passing here
    const handleSubmit = (event) => {
        alert(TextValue);
        event.preventDefault();
        props.navigation.navigate('Detail')
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
            <Text>Time</Text>
            <DatePicker date={date} onDateChange={setDate} />
            </View>

            <View>
            <Text>Duration</Text>
            <Text><NumericInput
                minValue = {0}
                value={DurationValue}
                onChange={setDurationValue}
            />
            <Text>minutes</Text></Text>
            </View>

            <View style={{zIndex: 3000}}>
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
                dropDownContainerStyle={{ backgroundColor: 'white',zIndex: 3000, elevation: 3000 }}
            />
            </View>

            <View style={{zIndex: 2000}}>
            <Text>Color</Text>
            <DropDownPicker
                open={ColorOpen}
                onOpen={onColorOpen}
                value={ColorValue}
                items={ColorItems}
                setOpen={setColorOpen}
                setValue={setColorValue}
                setItems={setColorItems}
                dropDownDirection={"AUTO"}
                dropDownContainerStyle={{ backgroundColor: 'white',zIndex: 2000, elevation: 2000 }}
            />
            </View>

            <View style={{zIndex: 1000}}>
            <Text>Side Note</Text>
            <TextInput
                editable
                multiline
                numberOfLines={2}
                maxLength={40}
                onChangeText={text => onChangeText(text)}
                value={TextValue}
                placeholder="Side note about pu"
            />
            </View>

            <View>
            <Button title="Submit" onPress={handleSubmit} />
            </View>
        </View>
    );
}

export default PuForm;