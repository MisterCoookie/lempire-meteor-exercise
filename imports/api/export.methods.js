/**
 * Created by: ELISABETH Nathanaël
 * Created at: 2023-27-01
 */

// Meteor imports
import { Random } from 'meteor/random';

// External imports
import {faker} from "@faker-js/faker";

// Internal imports
import { EXPORT_FINAL_URLS, EXPORT_STATE, ExportCollection } from "../db/export.collection";

/**
 * Setup methods for export to be used all around the app
 * */
Meteor.methods({
    // Create new export item
    'exports.insert'() {
        ExportCollection.insert({
            name: faker.system.commonFileName(), // using fake to simulate file name
            state: EXPORT_STATE.SANDBOX,
            percent: 0,
            date: new Date(),
        })
    },
    // When an exported item is ready to go in the validating list
    'exports.setValidatingState'(exportingId) {
        // Set Item in validating state
        ExportCollection.update(exportingId, { $set: { state: EXPORT_STATE.VALIDATING, url: Random.choice(EXPORT_FINAL_URLS) }})

        // Get an exporting item left in the waiting list
        const waitingItem = ExportCollection.findOne({state: EXPORT_STATE.WAITING})
        // Check if there is an exporting item and if there is room in the exporting list
        if (waitingItem && ExportCollection.find({state: EXPORT_STATE.EXPORTING}).count() < 5) {
            // If yes then we update state
            ExportCollection.update(waitingItem._id, { $set: { state: EXPORT_STATE.EXPORTING }})
        }
    },
    // Each time the function is called add 5 to the percent of all exported item in the exporting list.
    'exports.progressExporting'() {
        const exportingItems = ExportCollection.find({state: EXPORT_STATE.EXPORTING})
        for (const exportingItem of exportingItems) {
            ExportCollection.update(exportingItem._id, { $set: { percent: exportingItem.percent + 5 }})
            const exportingItemUpdated = ExportCollection.findOne({_id: exportingItem._id})
            // If an export item reach 100 then we check to place him in the validating list
            if (exportingItemUpdated.percent === 100) {
                Meteor.call('exports.setValidatingState', exportingItemUpdated._id);
            }
        }
    },
    // When the user start the export, all the exported item go in the waiting list. If there are room in the exporting list then they go there
    'exports.flushToExport'() {
        const exportingItems = ExportCollection.find({state: EXPORT_STATE.SANDBOX})
        for (const exportingItem of exportingItems) {
            const state = ExportCollection.find({state: EXPORT_STATE.EXPORTING}).count() < 5 ? EXPORT_STATE.EXPORTING : EXPORT_STATE.WAITING
            ExportCollection.update(exportingItem._id, { $set: { state: state }})
        }
    },
    // When all export are done and the user validate them. Then we push them in the Ended State
    'exports.flushToEnd'() {
        const exportingItems = ExportCollection.find({state: EXPORT_STATE.VALIDATING})
        for (const exportingItem of exportingItems) {
            ExportCollection.update(exportingItem._id, { $set: { state: EXPORT_STATE.ENDED }})
        }
    },
    // simply remove any export from database
    'exports.remove'(exportId) {
        ExportCollection.remove(exportId)
    }
})
