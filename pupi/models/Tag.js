import {Realm} from '@realm/react';

export class Tag extends Realm.Object {
  constructor(realm, tag_obj) {
    super(realm, tag_obj);
  }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: 'Tag',
    primaryKey: '_id',
    properties: {
        _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
        name: 'string', 
        date_added: {type: 'date', default: () => new Date()},
        rel_sessions: {
            type: 'linkingObjects',
            objectType: 'Session',
            property: 'tags',
        },
    },
  };
}