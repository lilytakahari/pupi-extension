import {Realm} from '@realm/react';

export class Session extends Realm.Object {
  constructor(realm, session_obj) {
    super(realm, session_obj);
  }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: 'Session',
    primaryKey: '_id',
    properties: {
        _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
        pupi_type: 'string', 
        timestamp: {type: 'date', default: () => new Date()},
        duration: {type: 'int', default: 5},
        stool_shape: {type: 'int', default: 0},
        color: {type: 'string', default: ''},
        volume: {type: 'string', default: ''},
        notes: {type: 'string', default: ''},
        imagepath: {type: 'string', default: ''},
    },
  };
}