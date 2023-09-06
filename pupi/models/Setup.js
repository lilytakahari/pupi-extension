import 'react-native-get-random-values';
import {Realm} from '@realm/react';

export class Setup extends Realm.Object {
    constructor(realm, setup) {
        super(realm, setup);
    }
  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: 'Setup',
    primaryKey: '_id',
    properties: {
        _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
        date: {type: 'date', default: () => new Date()},
    },
  };
}