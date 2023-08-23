import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

import { useState, useEffect} from 'react';
import { View, Image } from 'react-native';
// Calendar
import {Agenda} from 'react-native-calendars';
import {Session} from '../models/Session';
import {SessionRealmContext} from '../models';

const {useRealm, useQuery, useObject} = SessionRealmContext;

const formatDate = d => [
  d.getFullYear(),
  (d.getMonth() + 1).toString().padStart(2, '0'),
  d.getDate().toString().padStart(2, '0')
].join('-');

function formatTime(date) {
  return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
}
/* DetailScreen()
 * Description: Shows detailed record of your pupi.
 *
 */
/*TODO for future:
there are infinitely many things wrong with how i am using the agenda / the agenda itself
- how to load more efficiently
- e.g. i could add listeners onto the realm instead of brute re-populating list
- the agenda doesn't update immediately if the agenda has items, but it works when the list is empty
--- it updates buggily (shows another entry but with wrong data)
- how to load when clicking on a different month (currently hard-coded to March)


*/
// Notes: the key in the items dictionary must be the YYYY-MM-DD string, 
// but parameters requiring just one date can accept Javascript Date object
function DetailScreen({navigation}) {
  const [agendaItems, setAgendaItems] = useState({});
  const realm = useRealm();
  const sessions = useQuery(Session);
  
  // TODO for future: you need to figure a way around this
  useEffect(() => {
      const now = new Date();
      const cal_obj = {
        timestamp: now.getTime(),
        month: now.getMonth()+1,
        year: now.getFullYear(),
      };
      loadMonth(cal_obj);
    }, []);

  function loadMonth(calendar_obj) {
    
    const items = {};
    const utc_timestamp = calendar_obj.timestamp;
    const month = calendar_obj.month.toString().padStart(2, '0');
    const year = calendar_obj.year.toString();
    for (let d = 1; d <= 31; d++) {
      const day = d.toString().padStart(2, '0');
      items[year + '-' + month + '-' + day] = [];
    }
    const start = new Date(utc_timestamp - 2629800000);  // subtract one month
    const end = new Date(utc_timestamp + 2629800000); // add one month

    // TODO FUTURE: no filtering, in case it doesn't work
    // const within_range = sessions.filtered("timestamp > $0 AND timestamp < $1", start, end);
    
    // added sorting
    const within_range = sessions.sorted("timestamp");

    for (let i = 0; i < within_range.length; i++) {
      const key = formatDate(within_range[i]['timestamp']);
      if (key in items) {
        items[key].push({
          id: within_range[i]['_id'].toString(),
          start: formatTime(within_range[i]['timestamp']),
          duration: within_range[i]['duration'],
          shape: within_range[i]['stool_shape'],
          type: within_range[i]['pupi_type'],
        });
      }
    }
    console.log('update items');
    setAgendaItems(items);
  }

  function navigate_forms(item) {
    if (item.type == 'pu') {
      navigation.navigate('Pu', {sessionId: item.id});
    } else {
      navigation.navigate('Pi', {sessionId: item.id});
    }
  }

  function IconSource(item) {
    if (item.type=='pu'){
        switch(item.shape) {
            case 1:
                return require('../assets/dropdownIcon/pu_shape1.png')
                break
            case 2:
                return require('../assets/dropdownIcon/pu_shape2.png')
            case 3:
                return require('../assets/dropdownIcon/pu_shape3.png')
            case 4:
                return require('../assets/dropdownIcon/pu_shape4.png')
            case 5:
                return require('../assets/dropdownIcon/pu_shape5.png')
            case 6:
                return require('../assets/dropdownIcon/pu_shape6.png')
            case 7:
                return require('../assets/dropdownIcon/pu_shape7.png')
        }
    }else{
        return require('../assets/drop.png')
    }
  }

  //<Text style={styles.itemText}>Type{item.type=='pu'?(' '+ item.shape):''} {item.type}</Text>
  return (
    <SafeAreaView style={styles.container}>
          <Agenda
            selected={new Date()}
            items={agendaItems}
            onDayPress={loadMonth}
            renderItem={(item, isFirst) => (
              <TouchableOpacity onPress={() => navigate_forms(item)}
                style={item.type=='pu'?(styles.pu_entry):(styles.pi_entry)}>
                <Image
                    source={IconSource(item)}
                    style={styles.entry_img}
                />

                <View>
                    <Text style={styles.itemText}>{item.start}</Text>
                    <Text style={styles.itemText}>{item.duration} mins</Text>

                </View>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
  );
}

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  pi_entry: {
    backgroundColor: '#fffbeb',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    flexDirection:"row",
    alignItems:"center",
  },
  pu_entry: {
    backgroundColor: '#e6d9d3',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    flexDirection:"row",
    alignItems:"center",
  },
  itemText: {
    color: '#888',
    fontSize: 16,
  },
  entry_img: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
});