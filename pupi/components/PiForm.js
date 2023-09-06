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
    ScrollView,
    TouchableOpacity
  } from 'react-native';
import DatePicker from 'react-native-date-picker';
import NumericInput from 'react-native-numeric-input';
import DropDownPicker from 'react-native-dropdown-picker';
import { TagSelect } from 'react-native-tag-select';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

function formatDate(date) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  const formattedDate = `${daysOfWeek[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}, ${formattedHours}:${formattedMinutes} ${ampm}`;

  return formattedDate;
}

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
    const [dateOpen, setDateOpen] = useState(false);

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
        Alert.alert('Success');
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
    const tag_array = Array.from(tag_list);

    const selected = updateSession?(Array.from(sessionData.tags)):([]);

    const handleNewFactor = (name) => {
      const tag_exists = tag_list.filtered('name ==[c] $0', name);
      if (tag_exists.length == 0) {
        realm.write(() => {
          realm.create(
              'Tag', 
              {name: name},
          );}
        );
        Alert.alert('Success');
      } else {
        Alert.alert('Factor already exists');
      }
    }
    const onNewFactorPress = () => {
      Alert.prompt(
        'Name of new factor:',
        '',
        handleNewFactor
      );
    }
    

    return (
        <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
            <View style={styles.section}>
            <Text style={styles.titleText}>Time</Text>
            <TouchableOpacity 
              style={styles.title}
              onPress={() => setDateOpen(true)}>
              <Text style={styles.titleText}>{formatDate(date)}</Text>
              <Ionicons name="create-outline" size={20} />
            </TouchableOpacity>
            <DatePicker 
              modal 
              onConfirm={(date) => {
                setDateOpen(false)
                setDate(date)
              }}
              onCancel={() => {
                setDateOpen(false)
              }}
              open={dateOpen}
              date={date} 
              onDateChange={setDate} 
              />
            </View>

            <View style={styles.section}>
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
                style={{borderColor: 'white'}}
                labelStyle={{
                  fontSize: 16,
                }}
            />
            </View>

            <View>
              <View style={styles.factorsRow}>
                <Text style={styles.titleText}>Effective Factors</Text>
                <TouchableOpacity style={styles.addButton}
                  onPress={onNewFactorPress}>
                <Ionicons name="add-circle-outline" size={20} />
                  <Text style={{fontSize: 16, paddingLeft: 2,}}>New Factor</Text>
                </TouchableOpacity>
              </View>
            
            <TagSelect
              data={tag_array}
              value={selected}
              itemLabelStyle={{color: 'black', fontSize: 16,}}
              itemStyle={styles.item}
              labelAttr="name"
              keyAttr="_id"
              ref={(tag) => {
                this.tag = tag;
              }}
            />
            </View>

            <View style={styles.section}>
            <Text style={styles.titleText}>Duration</Text>
            <View style={styles.numericInputStyle}>
                <NumericInput
                    rounded
                    borderColor={'#FFF'}
                    minValue = {0}
                    value={DurationValue}
                    onChange={setDurationValue}
                />
                <Text style={styles.minutesText}>minute(s)</Text>
            </View>
            </View>

            

            <View style={styles.section}>
            <Text style={styles.titleText}>Notes</Text>
              <View style={styles.textInputContainer}>
              <TextInput
                  editable
                  multiline
                  maxLength={100}
                  onChangeText={text => onChangeText(text)}
                  value={TextValue}
                  placeholder="Side note about pi"
                  style={styles.textInput}
              />
              <Text style={styles.textCharCount}>{TextValue.length}/100</Text>
              </View>
            </View>

            <View style={styles.endEmptySpace}></View>
        </ScrollView>
        <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={styles.floatingButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        </View>
        </SafeAreaView>
    );
}

export default PiForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 10,
    paddingTop: -5,
  },
  titleText: {
    fontSize: 20,
    paddingVertical: 5,
  },
  minutesText: {
    marginLeft: 10,
    fontSize: 16,
  },
  section: {
    marginBottom: 10,
  },
  item: {
    borderRadius: 10,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  addButton: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  factorsRow: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'flex-end',
  },
  dropdownIcon: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  numericInputStyle:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 2,
  },
  textInput: {
    padding: 10,
    paddingTop: 10,
  },
  textInputContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  textCharCount: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginRight: 10,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 16, 
    alignSelf: 'center', 
  },
  floatingButton: {
    flexDirection: 'row',
    backgroundColor: '#00bef8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  endEmptySpace: {
    height: 70,
  }
});