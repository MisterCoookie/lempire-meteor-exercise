import { check } from 'meteor/check'
import { ExportCollection } from "../db/export.collection";

Meteor.methods({
    'exports.insert'() {

    },
    'exports.updateLoadingPercent'() {

    },
    'exports.updateState'() {

    },
    'exports.remove'(exportId) {
        ExportCollection.remove(exportId)
    }
})