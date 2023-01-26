/**
 * Created by: ELISABETH Nathanaël
 * Created at: 2023-27-01
 */

// Meteor imports
import { Template } from 'meteor/templating';

// Internal imports
import {EXPORT_STATE} from "../../../db/export.collection";

// Blaze template import
import './export.component.html'

// Template setup
Template.exportComponent.helpers({
    getPercent() {
        return this.percent + '%'
    },
    getText() {
        // Used to return text by checking the current state of the export
        switch (this.state) {
            case EXPORT_STATE.SANDBOX:
                return "In Sandbox";
            case EXPORT_STATE.WAITING:
                return "Waiting";
            default:
                return this.url;
        }
    },
    isNotExporting() {
        return this.state !== EXPORT_STATE.EXPORTING
    },
    isExporting() {
        return this.state == EXPORT_STATE.EXPORTING
    }
})

Template.exportComponent.events({
    'click #deleteExportButton'() {
        Meteor.call('exports.remove', this._id)
    }
})
