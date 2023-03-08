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

/* PiForm()
 * Description: The form for users to input their pupi record
 *
 */
/*TODO: make sure this form can send data to realm*/
// add icon in dropdown menu: https://blog.consisty.com/react-native/dropdown_with_images/
function PiForm(props) {
    const realm = useRealm();
    

    //datetimepicker
    const [date, setDate] = useState(new Date())

    // duration
    const [DurationValue, setDurationValue] = useState(5);

    //dropdownpicker
    const [ShapeOpen, setShapeOpen] = useState(false);
    const onShapeOpen = () => {setColorOpen(false);};

    const [ColorOpen, setColorOpen] = useState(false);
    const onColorOpen = () => {setShapeOpen(false);};
    const [ColorValue, setColorValue] = useState('pi_color3');
    const [ColorItems, setColorItems] = useState([
        {label: 'Brown', value: 'pi_color1'},
        {label: 'Dark Yellow', value: 'pi_color2'},
        {label: 'Yellow', value: 'pi_color3'},
        {label: 'Light Yellow', value: 'pi_color4'},
        {label: 'Transparent', value: 'pi_color5'},
    ]);
    const pi_color_map = {
        'pi_color1': 'Brown',
        'pi_color2': 'Dark Yellow',
        'pi_color3': 'Yellow',
        'pi_color4': 'Light Yellow',
        'pi_color5': 'Transparent',
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
            pupi_type: 'pi',
            timestamp: date,
            color: pi_color_map[ColorValue],
            notes: TextValue,
        }
        realm.write(() => {
            return new Session(realm, new_form);
        });

    }

    return (
        <View>
            <Text>Time</Text>
            <DatePicker date={date} onDateChange={setDate} />

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
            />
            <Text>Side Note</Text>
            <TextInput
                editable
                multiline
                numberOfLines={2}
                maxLength={40}
                onChangeText={text => onChangeText(text)}
                value={TextValue}
                placeholder="Side note about pi"
            />

            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
}

export default PiForm;