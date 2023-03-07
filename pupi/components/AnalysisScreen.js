import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useState } from 'react';

// Calendar
import {Session} from '../models/Session';
import {SessionRealmContext} from '../models';

const {useRealm, useQuery, useObject} = SessionRealmContext;

/* AnalysisScreen()
 * Description: Shows analysis of your pupi record.
 *
 */
/*TODO: Find the package to visualize data
*/
function AnalysisScreen(props) {

  const realm = useRealm();
  const sessions = useQuery(Session);


  return (
    <View style={styles.container}>
        <Text>Screen for Analysis</Text>
    </View>
  );
}

export default AnalysisScreen;

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