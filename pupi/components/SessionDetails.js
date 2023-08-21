import {
    SafeAreaView,
    StyleSheet,
    Text,
  } from 'react-native';

import {Realm} from '@realm/react';
import {SessionRealmContext} from '../models';
import {Session} from '../models/Session';
const {useRealm, useQuery, useObject} = SessionRealmContext;


function SessionDetails({route, navigation}) {
    const { itemId } = route.params;
    const session = useObject(Session, Realm.BSON.ObjectID(itemId));
    return (
        <SafeAreaView style={styles.container}>
            <Text>{session.pupi_type}</Text>
        </SafeAreaView>
    );
}

export default SessionDetails;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
});