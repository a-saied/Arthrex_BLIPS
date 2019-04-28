import { Meteor } from 'meteor/meteor';

import Networking from './../imports/networking';

import {distanceData, rawData, app} from './../imports/dataCollection.js';

Meteor.startup(() => {
  // code to run on server at startup
  rawData.remove({});
  distanceData.remove({});
  app.remove({});
});
