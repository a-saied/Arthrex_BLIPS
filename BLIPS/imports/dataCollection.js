import { Mongo } from 'meteor/mongo';

export const distanceData = new Mongo.Collection('distance');
export const rawData = new Mongo.Collection('position');
export const app = new Mongo.Collection('app');
export const badges = new Mongo.Collection('badges'); 