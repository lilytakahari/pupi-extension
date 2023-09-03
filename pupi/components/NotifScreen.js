import {
    SafeAreaView,
    StyleSheet,
    Text,
    Dimensions,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';

import {Realm} from '@realm/react';

import { useState } from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import { SessionRealmContext } from '../models';
import { Reminder } from '../models/Reminder';

import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';

const {useRealm, useQuery, useObject} = SessionRealmContext;


function removeNotification(notif_id) {
    PushNotificationIOS.removePendingNotificationRequests([notif_id]);
}

function formatDate(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
  
    const formattedDate = `${formattedHours}:${formattedMinutes} ${ampm}`;
  
    return formattedDate;
}

function NotifScreen({route, navigation}) {
    
    const realm = useRealm();
    const reminders = useQuery(Reminder);

    const deletePress = (notif_id) => {
        const exists = reminders.filtered("notif_id == $0", notif_id);
        if (exists.length != 0) {
            realm.write(() => {
                realm.delete(exists[0]);
            });
            removeNotification(notif_id);
        }
    }
    
    const confirmNotification = (date, notif_id, topic='', text) => {
        const exists = reminders.filtered("notif_id == $0", notif_id);
        let primary_key = null;
        let updateReminder = false;
        if (exists.length != 0) {
            removeNotification(notif_id);
            primary_key = exists[0]._id;
            updateReminder = true;
        }
        PushNotificationIOS.addNotificationRequest({
            id: notif_id,
            title: 'Pupi',
            subtitle: topic,
            body: text,
            fireDate: date,
            repeats: true,
            repeatsComponent: {
              hour: true,
              minute: true,
            }
        });
        const new_form = {
            _id: updateReminder?(primary_key):(new Realm.BSON.ObjectId()),
            notif_id: notif_id,
            date: date,
        };
        realm.write(() => {
            realm.create(
                'Reminder', 
                new_form,
                'modified',
            );}
        );
    }

    const hydrateReminder = reminders.filtered("notif_id == $0", 'hydrate');
    const breakReminder = reminders.filtered("notif_id == $0", 'breakfast');
    const lunchReminder = reminders.filtered("notif_id == $0", 'lunch');
    const dinnerReminder = reminders.filtered("notif_id == $0", 'dinner');

    const [dateHydrate, setDateHydrate] = useState((hydrateReminder.length == 0)?(new Date()):(hydrateReminder[0].date));
    const [dateHydrateOpen, setHydrateDateOpen] = useState(false);

    const [dateBreakfast, setDateBreakfast] = useState((breakReminder.length == 0)?(new Date()):(breakReminder[0].date));
    const [dateBreakOpen, setBreakDateOpen] = useState(false);

    const [dateLunch, setDateLunch] = useState((lunchReminder.length == 0)?(new Date()):(lunchReminder[0].date));
    const [dateLunchOpen, setLunchDateOpen] = useState(false);

    const [dateDinner, setDateDinner] = useState((dinnerReminder.length == 0)?(new Date()):(dinnerReminder[0].date));
    const [dateDinnerOpen, setDinnerDateOpen] = useState(false);
    

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.view}>

            <View style={styles.section}>
                <Text style={styles.titleText}>Daily Hydration Reminder</Text>
                <View style={styles.row}>
                    <TouchableOpacity 
                        style={styles.touchBubble}
                        onPress={() => setHydrateDateOpen(true)}>

                        <Text style={styles.titleText}>{(hydrateReminder.length == 0)?('Choose a time here.'):(formatDate(dateHydrate))}</Text>
                        <Ionicons name="create-outline" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}} onPress={() => {deletePress('hydrate'); Alert.alert('Success');}}>
                        <Ionicons name="trash-outline" size={20} color='red' style={{alignSelf: 'center'}}/>
                    </TouchableOpacity>
                </View>
              
            
            <DatePicker 
              modal 
              mode='time'
              onConfirm={(date) => {
                setHydrateDateOpen(false);
                setDateHydrate(date);
                confirmNotification(date, 'hydrate', 'Hydration reminder', "It's a great day to stay hydrated!");
              }}
              onCancel={() => {
                setHydrateDateOpen(false)
              }}
              open={dateHydrateOpen}
              date={dateHydrate} 
              onDateChange={setDateHydrate} 
              />
              </View>

              <View>
                <Text style={styles.titleText}>Fiber Reminders for Meals</Text>
              </View>


              <View style={styles.section}>
                <Text style={styles.subtitleText}>Breakfast</Text>
                <View style={styles.row}>
                    <TouchableOpacity 
                        style={styles.touchBubble}
                        onPress={() => setBreakDateOpen(true)}>

                        <Text style={styles.titleText}>{(breakReminder.length == 0)?('Choose a time here.'):(formatDate(dateBreakfast))}</Text>
                        <Ionicons name="create-outline" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}} onPress={() => {deletePress('breakfast'); Alert.alert('Success');}}>
                        <Ionicons name="trash-outline" size={20} color='red' style={{alignSelf: 'center'}}/>
                    </TouchableOpacity>
                </View>
              
            <DatePicker 
              modal 
              mode='time'
              onConfirm={(date) => {
                setBreakDateOpen(false);
                setDateBreakfast(date);
                confirmNotification(date, 'breakfast', 'Fiber reminder', 'Enjoy your breakfast with extra fiber!');
              }}
              onCancel={() => {
                setBreakDateOpen(false)
              }}
              open={dateBreakOpen}
              date={dateBreakfast} 
              onDateChange={setDateBreakfast} 
              />
              </View>


              <View style={styles.section}>
                <Text style={styles.subtitleText}>Lunch</Text>
                <View style={styles.row}>
                    <TouchableOpacity 
                        style={styles.touchBubble}
                        onPress={() => setLunchDateOpen(true)}>

                        <Text style={styles.titleText}>{(lunchReminder.length == 0)?('Choose a time here.'):(formatDate(dateLunch))}</Text>
                        <Ionicons name="create-outline" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}} onPress={() => {deletePress('lunch'); Alert.alert('Success');}}>
                        <Ionicons name="trash-outline" size={20} color='red' style={{alignSelf: 'center'}}/>
                    </TouchableOpacity>
                </View>
              
            
            <DatePicker 
              modal 
              mode='time'
              onConfirm={(date) => {
                setLunchDateOpen(false);
                setDateLunch(date);
                confirmNotification(date, 'lunch', 'Fiber reminder', 'Get through the rest of the day with more fiber!');
              }}
              onCancel={() => {
                setLunchDateOpen(false)
              }}
              open={dateLunchOpen}
              date={dateLunch} 
              onDateChange={setDateLunch} 
              />
              </View>
              

              <View style={styles.section}>
                <Text style={styles.subtitleText}>Dinner</Text>
                <View style={styles.row}>
                    <TouchableOpacity 
                        style={styles.touchBubble}
                        onPress={() => setDinnerDateOpen(true)}>

                        <Text style={styles.titleText}>{(dinnerReminder.length == 0)?('Choose a time here.'):(formatDate(dateDinner))}</Text>
                        <Ionicons name="create-outline" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}} onPress={() => {deletePress('dinner'); Alert.alert('Success');}}>
                        <Ionicons name="trash-outline" size={20} color='red' style={{alignSelf: 'center'}}/>
                    </TouchableOpacity>
                </View>
              
            
            <DatePicker 
              modal 
              mode='time'
              onConfirm={(date) => {
                setDinnerDateOpen(false);
                setDateDinner(date);
                confirmNotification(date, 'dinner', 'Fiber reminder', "Dinner can't be without some extra fiber.");
              }}
              onCancel={() => {
                setDinnerDateOpen(false)
              }}
              open={dateDinnerOpen}
              date={dateDinner} 
              onDateChange={setDateDinner} 
              />
              </View>

        </View>
        </SafeAreaView>
    );
}

export default NotifScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view: {
        flex: 1,
        padding: 10,
        paddingRight: -10,
    },
    section: {
        marginBottom: 10,
    },
    titleText: {
        fontSize: 20,
        paddingVertical: 5,
    },
    subtitleText: {
        fontSize: 16,
        color: '#888',
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    touchBubble: {
        flex: 6,
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
    }
});