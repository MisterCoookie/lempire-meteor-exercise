import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './export.component.html'
import {EXPORT_STATE} from "../../../db/export.collection";

const PERCENT_LOADING_STRING = 'PERCENT_LOADING_STRING'

Template.exportComponent.onCreated(function exportComponentOnCreated() {
    this.reactiveDict = new ReactiveDict();
    this.reactiveDict.set(PERCENT_LOADING_STRING, 0)
})


Template.exportComponent.helpers({
    getPercent() {
        return this.percent + '%'
    },
    getText() {
        switch (this.state) {
            case EXPORT_STATE.SANDBOX:
                return "In Sandbox";
            case EXPORT_STATE.WAITING:
                return "Waiting";
            case EXPORT_STATE.VALIDATING:
                return this.url;
            case EXPORT_STATE.ENDED:
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
