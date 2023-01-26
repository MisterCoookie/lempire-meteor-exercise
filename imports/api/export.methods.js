import { check } from 'meteor/check'
import {EXPORT_STATE, ExportCollection, getRandomFinalUrl} from "../db/export.collection";
import {faker} from "@faker-js/faker";

Meteor.methods({
    'exports.insert'() {
        ExportCollection.insert({
            name: faker.system.commonFileName(),
            state: EXPORT_STATE.SANDBOX,
            percent: 0,
            date: new Date(),
        })
    },
    'exports.setValidatingState'(exportingId) {
        // Set Item in validating state
        ExportCollection.update(exportingId, { $set: { state: EXPORT_STATE.VALIDATING, url: getRandomFinalUrl() }})

        // Get an exporting item left in the waiting list
        const waitingItem = ExportCollection.findOne({state: EXPORT_STATE.WAITING})
        // Check if there is an exporting item and if there is room in the exporting list
        if (waitingItem && ExportCollection.find({state: EXPORT_STATE.EXPORTING}).count() < 5) {
            // If yes then we update state
            ExportCollection.update(waitingItem._id, { $set: { state: EXPORT_STATE.EXPORTING }})
        }
    },
    'exports.progressExporting'() {
        const exportingItems = ExportCollection.find({state: EXPORT_STATE.EXPORTING})
        for (const exportingItem of exportingItems) {
            ExportCollection.update(exportingItem._id, { $set: { percent: exportingItem.percent + 5 }})
            if (exportingItem.percent === 100) {
                Meteor.call('exports.setValidatingState', exportingItem._id);
            }
        }
    },
    'exports.flushToExport'() {
        const exportingItems = ExportCollection.find({state: EXPORT_STATE.SANDBOX})
        for (const exportingItem of exportingItems) {
            const state = ExportCollection.find({state: EXPORT_STATE.EXPORTING}).count() < 5 ? EXPORT_STATE.EXPORTING : EXPORT_STATE.WAITING
            ExportCollection.update(exportingItem._id, { $set: { state: state }})
        }
    },
    'exports.flushToEnd'() {
        const exportingItems = ExportCollection.find({state: EXPORT_STATE.VALIDATING})
        for (const exportingItem of exportingItems) {
            ExportCollection.update(exportingItem._id, { $set: { state: EXPORT_STATE.ENDED }})
        }
    },
    'exports.remove'(exportId) {
        ExportCollection.remove(exportId)
    }
})
