import {Realm, createRealmContext} from '@realm/react';
import {Session} from './Session';
import {Tag} from './Tag';

export const SessionRealmContext = createRealmContext({
  schema: [Session, Tag],
});
