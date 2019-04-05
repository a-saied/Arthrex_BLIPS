import { Meteor } from 'meteor/meteor';

import {distanceData, positionData, app} from './../imports/dataCollection.js';

Meteor.startup(() => {
  // code to run on server at startup
  positionData.remove({});
  distanceData.remove({});
  app.remove({});
});
