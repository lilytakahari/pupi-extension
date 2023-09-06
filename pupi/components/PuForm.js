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
    TouchableOpacity,
    ScrollView
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
/* PuForm()
 * Description: The form for users to input their pupi record
 * shape chart: https://www.webmd.com/digestive-disorders/poop-chart-bristol-stool-scale
 * color chart: https://www.buoyhealth.com/learn/what-do-stool-colors-mean
 */
// TODO: Change the format according to light mode and dark mode
// under dark mode, Date Picker's text color will be white, which make it hard to read
// TODO: The icons I used for stool shape are modified from the internet. I recommend redrawing them by yourself.
function PuForm({route, navigation}) {
    const { sessionId } = route.params;
    let updateSession = false;
    let sessionData = {};
    if (sessionId != "") {
        updateSession = true;
        sessionData = useObject(Session, Realm.BSON.ObjectID(sessionId));
    }
    

    const realm = useRealm();

    //datetimepicker
    const [date, setDate] = useState(updateSession?(sessionData.timestamp):(new Date()));
    const [dateOpen, setDateOpen] = useState(false);

    // duration
    const [DurationValue, setDurationValue] = useState(updateSession?(sessionData.duration):(5));

    //dropdownpicker
    const [ShapeOpen, setShapeOpen] = useState(false);
    const onShapeOpen = () => {setColorOpen(false);};
    const [ShapeValue, setShapeValue] = useState(updateSession?('pu_shape' + sessionData.stool_shape):('pu_shape3'));
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
    const pu_color_reverse_map = {
        'Black': 'pu_color1',
        'Brown': 'pu_color2',
        'Light Brown': 'pu_color3',
        'Red': 'pu_color4',
        'Green': 'pu_color5',
        'Yellow': 'pu_color6',
    }

    const [ColorOpen, setColorOpen] = useState(false);
    const onColorOpen = () => {setShapeOpen(false);};
    const [ColorValue, setColorValue] = useState(updateSession?(pu_color_reverse_map[sessionData.color]):('pu_color2'));
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
    const [TextValue, onChangeText] = useState(updateSession?sessionData.notes:'');

    // Submit
    // Handle the value passing here
    const handleSubmit = (event) => {
        //alert(TextValue);
        Alert.alert('Success');
        event.preventDefault();
        navigation.navigate('Home');
        // insert Realm usage here
        const new_form = {
            _id: updateSession?(Realm.BSON.ObjectId(sessionId)):(new Realm.BSON.ObjectId()),
            pupi_type: 'pu',
            timestamp: date,
            duration: DurationValue,
            stool_shape: pu_shape_map[ShapeValue],
            color: pu_color_map[ColorValue],
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
                style={{borderColor: 'white'}}
                labelStyle={{
                  fontSize: 16,
                }}
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
                    placeholder="Side note about pu"
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

export default PuForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 10,
    paddingTop: -5,
  },
  item: {
    borderRadius: 10,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
  },
  titleText: {
    fontSize: 20,
    paddingVertical: 5,
  },
  minutesText: {
    marginLeft: 10,
    fontSize: 16,
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
  section: {
    marginBottom: 10,
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