import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

// Calendar
import {Agenda} from 'react-native-calendars'

/* DetailScreen()
 * Description: Shows detailed record of your pupi.
 *
 */
/*TODO: implement loading data, and display format*/
// fix: no entry, no loading sign
// Notes: the key in the items dictionary must be the YYYY-MM-DD string, 
// but parameters requiring just one date can accept Javascript Date object
function DetailScreen(props) {
  return (
    <SafeAreaView style={styles.container}>
          <Agenda
            selected={new Date(2023, 1, 8, 3, 24, 0)}
            items={{
              '2023-02-01': [{start:'5:00pm' , duration: 2, shape: 'Type 1'},
                              {start:'3:00pm' , duration: 2, shape: 'Type 2'}],
              '2023-02-29': [{start:'3:00pm' , duration: 2, shape: 'Type 2'}]
            }}
            renderItem={(item, isFirst) => (
              <TouchableOpacity style={styles.item}>
                <Text style={styles.itemText}>{item.start}</Text>
                <Text style={styles.itemText}>{item.duration} mins</Text>
                <Text style={styles.itemText}>{item.shape}</Text>
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