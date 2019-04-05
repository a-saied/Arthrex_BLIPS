import { Mongo } from 'meteor/mongo';

export const distanceData = new Mongo.Collection('distance');
export const positionData = new Mongo.Collection('position');
export const app = new Mongo.Collection('app');