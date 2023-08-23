import { useState } from 'react';
import {
    Button,
    Text,
    TextInput,
    View,
    StyleSheet,
    Image,
    Dimensions,
    Alert,
    SafeAreaView,
    ScrollView
  } from 'react-native';
import DatePicker from 'react-native-date-picker';
import NumericInput from 'react-native-numeric-input';
import DropDownPicker from 'react-native-dropdown-picker';
import { TagSelect } from 'react-native-tag-select';

import {Realm} from '@realm/react';
import {Session} from '../models/Session';
import {Tag} from '../models/Tag';
import {SessionRealmContext} from '../models';

const {useRealm, useQuery, useObject} = SessionRealmContext;
const windowWidth = Dimensions.get('window').width;

/* PiForm()
 * Description: The form for users to input their pupi record
 * color chart: https://www.healthdirect.gov.au/urine-colour-chart
 */
// TODO: Change the format according to light mode and dark mode
// under dark mode, Date Picker's text color will be white, which make it hard to read

function PiForm({route, navigation}) {
    const { sessionId } = route.params;
    let updateSession = false;
    let sessionData = {};
    if (sessionId != "") {
        updateSession = true;
        sessionData = useObject(Session, Realm.BSON.ObjectID(sessionId));
    }

    const realm = useRealm();
    
    const [tags, setTags] = useState([]);
    //datetimepicker
    const [date, setDate] = useState(updateSession?(sessionData.timestamp):(new Date()));

    // duration
    const [DurationValue, setDurationValue] = useState(updateSession?(sessionData.duration):(1));

    //dropdownpicker
    const [ShapeOpen, setShapeOpen] = useState(false);
    const onShapeOpen = () => {setColorOpen(false);};

    const pi_color_reverse_map = {
      'Brown' : 'pi_color1',
      'Dark Yellow' : 'pi_color2',
      'Yellow' : 'pi_color3',
      'Light Yellow' : 'pi_color4',
      'Transparent' : 'pi_color5',
  };
    const [ColorOpen, setColorOpen] = useState(false);
    const onColorOpen = () => {setShapeOpen(false);};
    const [ColorValue, setColorValue] = useState(updateSession?(pi_color_reverse_map[sessionData.color]):'pi_color4');
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
    };
    

    //textinput
    const [TextValue, onChangeText] = useState(updateSession?sessionData.notes:'');

    // Submit
    // Handle the value passing here
    const handleSubmit = (event) => {
      Alert.alert('Selected tags', `${JSON.stringify(this.tag.itemsSelected)}`);
        //alert(TextValue);
        event.preventDefault();
        navigation.navigate('Home');
        // insert Realm usage here
        const new_form = {
            _id: updateSession?(Realm.BSON.ObjectId(sessionId)):(new Realm.BSON.ObjectId()),
            pupi_type: 'pi',
            timestamp: date,
            duration: DurationValue,
            color: pi_color_map[ColorValue],
            notes: TextValue,
            tags: this.tag.itemsSelected,
        };
        realm.write(() => {
          realm.create(
              'Session', 
              new_form,
              'modified',
          );}
        );

    }

    
    const tag_list = useQuery(Tag);
    console.log(tag_list);

    const selected = updateSession?(sessionData.tags):([]);
    

    return (
        <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
            <View>
            <Text style={styles.titleText}>Time</Text>
            <DatePicker date={date} onDateChange={setDate} style={styles.datepickerStye}/>
            </View>

            <TagSelect
              data={tag_list}
              value={selected}
              labelAttr="name"
              keyAttr="_id"
              ref={(tag) => {
                this.tag = tag;
              }}
            />
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
            <Button title="Submit" color='#00bef8' onPress={handleSubmit} style={styles.btn}/>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

export default PiForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    margin: 5,
  },
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