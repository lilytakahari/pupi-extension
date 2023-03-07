import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

import { useState } from 'react';

// Calendar
import {Agenda} from 'react-native-calendars';
import {Session} from '../models/Session';
import {SessionRealmContext} from '../models';

const {useRealm, useQuery, useObject} = SessionRealmContext;

/* DetailScreen()
 * Description: Shows detailed record of your pupi.
 *
 */
/*TODO:  display format*/
// fix: no entry, no loading sign
// Notes: the key in the items dictionary must be the YYYY-MM-DD string, 
// but parameters requiring just one date can accept Javascript Date object
function DetailScreen(props) {
  const [agendaItems, setAgendaItems] = useState({});
  const realm = useRealm();
  const sessions = useQuery(Session);
  
  const formatDate = d => [
    d.getFullYear(),
    (d.getMonth() + 1).toString().padStart(2, '0'),
    d.getDate().toString().padStart(2, '0')
  ].join('-');

  function formatTime(date) {
    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
  }

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
    // const within_range = sessions.filtered("timestamp > $0 AND timestamp < $1", start, end);
    
    
    const within_range = sessions;
    for (let i = 0; i < within_range.length; i++) {
      const key = formatDate(within_range[i]['timestamp']);
      if (key in items) {
        items[key].push({
          start: formatTime(within_range[i]['timestamp']),
          duration: within_range[i]['duration'],
          shape: within_range[i]['stool_shape'],
        });
      }
    }
    console.log(items);
    setAgendaItems(items);
  }
  return (
    <SafeAreaView style={styles.container}>
          <Agenda
            selected={new Date()}
            items={agendaItems}
            renderItem={(item, isFirst) => (
              <TouchableOpacity style={styles.item}>
                <Text style={styles.itemText}>{item.start}</Text>
                <Text style={styles.itemText}>{item.duration} mins</Text>
                <Text style={styles.itemText}>Type {item.shape}</Text>
              </TouchableOpacity>
            )}
            onMonthChange={loadMonth}
            onDayPress={loadMonth}
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
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: '#888',
    fontSize: 16,
  },
});