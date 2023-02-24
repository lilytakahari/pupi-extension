import React from 'react';

import {SessionRealmContext} from './models';
import App from './App';

export default AppWrapper = () => {
  const {RealmProvider} = SessionRealmContext;

  // If sync is disabled, setup the app without any sync functionality and return early
  return (
      <RealmProvider>
        <App />
      </RealmProvider>
  );
};