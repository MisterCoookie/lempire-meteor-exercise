import {EXPORT_STATE, ExportCollection} from "../../../db/export.collection";
import {ReactiveDict} from "meteor/reactive-dict";

import './itemContainer.component.html'

const IS_LOADING_STRING = 'IS_LOADING_STRING'
Template.exportItemsContainer.onCreated(function exportItemsContainerOnCreated() {
    this.reactiveDict = new ReactiveDict();

    const handler = Meteor.subscribe('exports');
    Tracker.autorun(() => {
        this.reactiveDict.set(IS_LOADING_STRING, !handler.ready());
    })
})

Template.exportItemsContainer.helpers({
    getExportItems() {
        console.log(this.itemContainerData)
        return ExportCollection.find({state: this.itemContainerData.exportState });
    },
    getExportItemsCounts() {
        return ExportCollection.find({state: this.itemContainerData.exportState }).count();
    },
    amount() {
        return this.itemContainerData.amount == -1 ? ExportCollection.find({state: this.itemContainerData.exportState }).count() : this.itemContainerData.amount
    }
})
