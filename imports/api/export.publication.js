import { Meteor } from "meteor/meteor";
import { ExportCollection } from "../db/export.collection";

Meteor.publish('exports', function () {
    return ExportCollection.find({});
})