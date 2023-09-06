import 'react-native-get-random-values';
import {Realm} from '@realm/react';

export class Reminder extends Realm.Object {
  constructor(realm, reminder_obj) {
    super(realm, reminder_obj);
  }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: 'Reminder',
    primaryKey: '_id',
    properties: {
        _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
        notif_id: 'string', 
        date: 'date',
    },
  };
}