/**
 * Created by: ELISABETH Nathanaël
 * Created at: 2023-27-01
 */

// Meteor imports
import { Meteor } from "meteor/meteor";
import { ExportCollection } from "../db/export.collection";

// Make export collection public and reachable in the front-end part
Meteor.publish('exports', function () {
    return ExportCollection.find({});
})
