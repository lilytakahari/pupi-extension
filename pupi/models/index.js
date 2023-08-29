import {Realm, createRealmContext} from '@realm/react';
import {Session} from './Session';
import {Tag} from './Tag';
import {Setup} from './Setup';

export const SessionRealmContext = createRealmContext({
  schema: [Session, Tag, Setup],
});
