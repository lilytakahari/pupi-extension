import { useState } from 'react';
import {
    Button,
    Text,
    TextInput,
    View,
    StyleSheet,
    Image,
  } from 'react-native';
import DatePicker from 'react-native-date-picker';
import NumericInput from 'react-native-numeric-input';
import DropDownPicker from 'react-native-dropdown-picker';

import {Session} from '../models/Session';
import {SessionRealmContext} from '../models';


const {useRealm, useQuery, useObject} = SessionRealmContext;

/* PiForm()
 * Description: The form for users to input their pupi record
 * color chart: https://www.healthdirect.gov.au/urine-colour-chart
 */
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
    const [ColorValue, setColorValue] = useState('pi_color4');
    const [ColorItems, setColorItems] = useState([
        {label: 'Brown', value: 'pi_color1',
         icon: () => (<Image source={require('../assets/dropdownIcon/pi_color1.png')} style={styles.dropdownIcon}/>),},
        {label: 'Dark Yellow', value: 'pi_color2',
         icon: () => (<Image source={require('../assets/dropdownIcon/pi_color2.png')} style={styles.dropdownIcon}/>),},
        {label: 'Yellow', value: 'pi_color3',
         icon: () => (<Image source={require('../assets/dropdownIcon/pi_color3.png')} style={styles.dropdownIcon}/>),},
        {label: 'Light Yellow', value: 'pi_color4',
         icon: () => (<Image source={require('../assets/dropdownIcon/pi_color4.png')} style={styles.dropdownIcon}/>),},
        {label: 'Transparent', value: 'pi_color5',
         icon: () => (<Image source={require('../assets/dropdownIcon/pi_color5.png')} style={styles.dropdownIcon}/>),},
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
        //alert(TextValue);
        event.preventDefault();
        props.navigation.navigate('Home')
        // insert Realm usage here
        const new_form = {
            pupi_type: 'pi',
            timestamp: date,
            duration: DurationValue,
            color: pi_color_map[ColorValue],
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
            <DatePicker date={date} onDateChange={setDate} />
            </View>

            <View>
            <Text style={styles.titleText}>Duration</Text>
            <Text><NumericInput
                minValue = {0}
                value={DurationValue}
                onChange={setDurationValue}
            />
            <Text style={styles.itemText}>minutes</Text></Text>
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
                dropDownContainerStyle={{ backgroundColor: 'white',zIndex: 1000, elevation: 1000 }}
                
            />
            </View>

            <View>
            <Text style={styles.titleText}>Side Note</Text>
            <TextInput
                editable
                multiline
                numberOfLines={2}
                maxLength={40}
                onChangeText={text => onChangeText(text)}
                value={TextValue}
                placeholder="Side note about pi"
            />
            </View>

            <View>
            <Button title="Submit" onPress={handleSubmit} style={styles.btn}/>
            </View>
        </View>
    );
}

export default PiForm;

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
});