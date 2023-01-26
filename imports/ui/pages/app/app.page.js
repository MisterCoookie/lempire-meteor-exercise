import {ReactiveDict} from "meteor/reactive-dict";
import {EXPORT_STATE, ExportCollection} from "../../../db/export.collection";
import {EXPORT_ITEMS_CONTAINERS} from "../../components/itemContainer/itemContainer.list";

import './app.page.html'

import '../../components/export/export.component.js'
import '../../components/itemContainer/itemContainer.component.js'

const IS_LOADING_STRING = 'IS_LOADING_STRING';
const IS_IN_EXPORT = 'IS_IN_EXPORT';
const EXPORTING_COUNT = 'EXPORTING_COUNT';

function setExportingValue(instance, status, count) {
    instance.reactiveDict.set(IS_IN_EXPORT, status);
    instance.reactiveDict.set(EXPORTING_COUNT, count);

    localStorage.setItem(IS_IN_EXPORT, status)
    localStorage.setItem(EXPORTING_COUNT, count)

    EXPORT_ITEMS_CONTAINERS.WAITING.amount = count
    EXPORT_ITEMS_CONTAINERS.VALIDATING.amount = count
}

function initExportingStatus(instance) {
    let status = false
    let count = 0

    if (localStorage.getItem(IS_IN_EXPORT) != null) {
        status = localStorage.getItem(IS_IN_EXPORT) === 'true';
        count = parseInt(localStorage.getItem(EXPORTING_COUNT));
    }

    setExportingValue(instance, status, count)
}

Template.AppPage.onCreated(function AppPageOnCreated() {
    this.reactiveDict = new ReactiveDict();

    initExportingStatus(this)

    const handler = Meteor.subscribe('exports');
    Tracker.autorun(() => {
        this.reactiveDict.set(IS_LOADING_STRING, !handler.ready());
    })
})

Template.AppPage.helpers({
    exportItemContainer() {
        return EXPORT_ITEMS_CONTAINERS
    },
    isExporting() {
        return Template.instance().reactiveDict.get(IS_IN_EXPORT);
    },
    isExportEnded() {
        return ExportCollection.find({state: EXPORT_STATE.VALIDATING}).count() === Template.instance().reactiveDict.get(EXPORTING_COUNT)
    }
})

Template.AppPage.events({
    'click #addTaskButton'() {
        if (ExportCollection.find({state: EXPORT_STATE.SANDBOX}).count() < 10) {
            Meteor.call('exports.insert', this._id)
        }
    },
    'click #launchExportButton'(event, instance) {
        if (instance.reactiveDict.get(IS_IN_EXPORT) === false) {
            setExportingValue(instance, true, ExportCollection.find({state: EXPORT_STATE.SANDBOX}).count())
            Meteor.call('exports.flushToExport')
        }
    },
    'click #validateButton'(event, instance) {
        if (ExportCollection.find({state: EXPORT_STATE.VALIDATING}).count() === Template.instance().reactiveDict.get(EXPORTING_COUNT)) {
            setExportingValue(instance, false, 0)
            Meteor.call('exports.flushToEnd')
        }
    }
})
