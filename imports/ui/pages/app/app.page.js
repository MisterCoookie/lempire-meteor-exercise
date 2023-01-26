/**
 * Created by: ELISABETH Nathanaël
 * Created at: 2023-27-01
 */

// Meteor imports
import {ReactiveDict} from "meteor/reactive-dict";

// Internal imports
import {EXPORT_STATE, ExportCollection} from "../../../db/export.collection";
import {EXPORT_ITEMS_CONTAINERS} from "../../components/itemContainer/itemContainer.list";

// Components imports
import '../../components/export/export.component.js'
import '../../components/itemContainer/itemContainer.component.js'

// Blaze template import
import './app.page.html'

// Page constants
const IS_LOADING_STRING = 'IS_LOADING_STRING';
const IS_IN_EXPORT = 'IS_IN_EXPORT';
const EXPORTING_COUNT = 'EXPORTING_COUNT';

// Page methods

/**
 * Set exporting status and count in all needed variable
 * @param instance { Blaze.TemplateInstance }
 * @param status { boolean }
 * @param count { number }
 */
function setExportingValue(instance, status, count) {
    instance.reactiveDict.set(IS_IN_EXPORT, status);
    instance.reactiveDict.set(EXPORTING_COUNT, count);

    localStorage.setItem(IS_IN_EXPORT, status)
    localStorage.setItem(EXPORTING_COUNT, count)

    EXPORT_ITEMS_CONTAINERS.WAITING.amount = count
    EXPORT_ITEMS_CONTAINERS.VALIDATING.amount = count
}

/**
 * Init page by looking in local storage for exporting status
 * @param instance { Blaze.TemplateInstance }
 */
function initExportingStatus(instance) {
    let status = false
    let count = 0

    if (localStorage.getItem(IS_IN_EXPORT) != null) {
        status = localStorage.getItem(IS_IN_EXPORT) === 'true';
        count = parseInt(localStorage.getItem(EXPORTING_COUNT));
    }

    setExportingValue(instance, status, count)
}

// Simpler getter to use in helpers
function getValidatedExportCount() {
    return ExportCollection.find({state: EXPORT_STATE.VALIDATING}).count()
}

function getSandboxExportCount() {
    return ExportCollection.find({state: EXPORT_STATE.SANDBOX}).count()
}

// Template setup
Template.AppPage.onCreated(function AppPageOnCreated() {
    this.reactiveDict = new ReactiveDict();

    initExportingStatus(this)

    const handler = Meteor.subscribe('exports');
    Tracker.autorun(() => {
        this.reactiveDict.set(IS_LOADING_STRING, !handler.ready());
    })
})

Template.AppPage.helpers({
    // exposing all container config to the template
    exportItemContainer() {
        return EXPORT_ITEMS_CONTAINERS
    },
    isExporting() {
        return Template.instance().reactiveDict.get(IS_IN_EXPORT);
    },
    isExportEnded() {
        return getValidatedExportCount() === Template.instance().reactiveDict.get(EXPORTING_COUNT)
    }
})

Template.AppPage.events({
    'click #addTaskButton'() {
        if (getSandboxExportCount() < 10) {
            Meteor.call('exports.insert', this._id)
        }
    },
    'click #launchExportButton'(event, instance) {
        if (getSandboxExportCount() > 0 && instance.reactiveDict.get(IS_IN_EXPORT) === false) {
            setExportingValue(instance, true, getSandboxExportCount())
            Meteor.call('exports.flushToExport')
        }
    },
    'click #validateButton'(event, instance) {
        if (getValidatedExportCount() === Template.instance().reactiveDict.get(EXPORTING_COUNT)) {
            setExportingValue(instance, false, 0)
            Meteor.call('exports.flushToEnd')
        }
    }
})
