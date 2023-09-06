import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    Share,
} from 'react-native';

import {Realm} from '@realm/react';

import { useState } from 'react';

import { SessionRealmContext } from '../models';
import {Session} from '../models/Session';

import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';

const { useQuery } = SessionRealmContext;

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

async function createFile(str, filename) {
    // require the module
    var RNFS = require('react-native-fs');

    // create a path you want to write to
    // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
    // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
    var path = RNFS.DocumentDirectoryPath + '/' + filename;

    // write the file
    RNFS.writeFile(path, str, 'utf8')
    .then((success) => {
        console.log('FILE WRITTEN!');
    })
    .catch((err) => {
        console.log(err.message);
    });
}

async function deleteFile(filename) {
    var RNFS = require('react-native-fs');

    var path = RNFS.DocumentDirectoryPath + '/' + filename;

    return RNFS.unlink(path)
    .then(() => {
        console.log('FILE DELETED');
    })
    // `unlink` will throw an error, if the item to unlink does not exist
    .catch((err) => {
        console.log(err.message);
    });
}

function tagsToStr(tags) {
    let sArr = [];
    for (let i = 0; i < tags.length; i++) {
        sArr[i] = tags[i].name;
    }
    return sArr.join('; ');
}

function sessionsToStr(sessions) {
    const options = {
        year: 'numeric',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };
    
    let sArr = ['pupi_type,timestamp,pu_shape,color,duration (minutes),notes,tags\n'];
    for (let i = 0; i < sessions.length; i++) {
        const s = sessions[i];
        const time = (s.timestamp).toLocaleString('en-US', options).replace(',', '');
        const tags = tagsToStr(s.tags);
        sArr[i+1] = `${s.pupi_type},${time},${s.stool_shape},${s.color},${s.duration},${s.notes},${tags}\n`;
    }
    const result = sArr.join('');
    return result;
}

function ShareScreen({route, navigation}) {
    const sessions = useQuery(Session);


    const [dateStart, setDateStart] = useState(new Date(new Date().getTime() - 2592000000));
    const [dateStartOpen, setDateStartOpen] = useState(false);

    const [dateEnd, setDateEnd] = useState(new Date());
    const [dateEndOpen, setDateEndOpen] = useState(false);

    const [open, setOpen] = useState(false);
    const [pupi_type, setValue] = useState('both');
    const [type_options, setItems] = useState([
        {label: 'Both Pu and Pi', value: 'both',
        icon: () => (<Image source={require('../assets/pupi-logo.png')} style={styles.dropdownIcon}/>),},
        {label: 'Pu only', value: 'pu',
        icon: () => (<Image source={require('../assets/poop.png')} style={styles.dropdownIcon}/>),},
        {label: 'Pi only', value: 'pi',
        icon: () => (<Image source={require('../assets/drop.png')} style={styles.dropdownIcon}/>),},
      ]);

    const onShare = async (filename) => {
        var RNFS = require('react-native-fs');
        const filepath = RNFS.DocumentDirectoryPath + '/' + filename;
        try {
            const result = await Share.share({
            url: filepath,
            });
            if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                // shared
            }
            } else if (result.action === Share.dismissedAction) {
            // dismissed
            }
            deleteFile('pupi_data.csv');
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert(error.message + '/nPlease try again.');
        }
    };
    
    const handleSubmit = () => {
        const time_filtered = sessions.filtered("timestamp > $0 AND timestamp < $1", dateStart, dateEnd);
        let target_data = null;
        if (pupi_type == 'pu') {
            target_data = time_filtered.filtered('pupi_type == $0', 'pu');
        } else if (pupi_type == 'pi') {
            target_data = time_filtered.filtered('pupi_type == $0', 'pi');
        } else {
            target_data = time_filtered;
        }
        const result_str = sessionsToStr(target_data);
        createFile(result_str, 'pupi_data.csv');
        onShare('pupi_data.csv');
    }

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.view}>
            <View style={styles.section}>
                <Text style={styles.titleText}>Export Pupi data as a .csv file.</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.titleText}>Beginning from:</Text>
                <TouchableOpacity 
                style={styles.touchBubble}
                onPress={() => setDateStartOpen(true)}>
                <Text style={styles.titleText}>{formatDate(dateStart)}</Text>
                <Ionicons name="create-outline" size={20} />
                </TouchableOpacity>
                <DatePicker 
                modal 
                onConfirm={(date) => {
                    setDateStartOpen(false)
                    setDateStart(date)
                }}
                onCancel={() => {
                    setDateStartOpen(false)
                }}
                open={dateStartOpen}
                date={dateStart} 
                onDateChange={setDateStart} 
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.titleText}>Up to:</Text>
                <TouchableOpacity 
                style={styles.touchBubble}
                onPress={() => setDateEndOpen(true)}>
                <Text style={styles.titleText}>{formatDate(dateEnd)}</Text>
                <Ionicons name="create-outline" size={20} />
                </TouchableOpacity>
                <DatePicker 
                modal 
                onConfirm={(date) => {
                    setDateEndOpen(false)
                    setDateEnd(date)
                }}
                onCancel={() => {
                    setDateEndOpen(false)
                }}
                open={dateEndOpen}
                date={dateEnd} 
                onDateChange={setDateEnd} 
                />
            </View>

            <View style={styles.sectionPicker}>
                <Text style={styles.titleText}>Type:</Text>
                <DropDownPicker
                    open={open}
                    value={pupi_type}
                    items={type_options}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={{borderColor: 'white'}}
                    labelStyle={{
                        fontSize: 20,
                        paddingVertical: 10,
                    }}
                    dropDownContainerStyle={{
                        borderColor: 'white',
                    }}
                    listItemLabelStyle={{
                        fontSize: 20,
                    }}
                />
            </View>
            <View style={styles.empty}></View>
            <View style={styles.floatingButtonContainer}>
                <TouchableOpacity style={styles.floatingButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Export</Text>
                </TouchableOpacity>
            </View>
        </View>
        </SafeAreaView>
    );
}

export default ShareScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view: {
        flex: 1,
        padding: 10,
    },
    section: {
        marginBottom: 10,
    },
    sectionPicker: {
        marginBottom: 10,
        zIndex: 2000,
    },
    section: {
        marginBottom: 10,
    },
    empty: {
        height: 20,
    },
    titleText: {
        fontSize: 20,
        paddingVertical: 5,
    },
    touchBubble: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownIcon: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
    },
    floatingButtonContainer: {
        alignSelf: 'center', 
        zIndex: 1000,
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
});