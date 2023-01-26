import {ReactiveDict} from "meteor/reactive-dict";
import {ExportCollection} from "../../../db/export.collection";

import './app.page.html'

import '../../components/export/export.component.js'

const IS_LOADING_STRING = 'IS_LOADING_STRING';

Template.AppPage.onCreated(function AppPageOnCreated() {
    this.state = new ReactiveDict();

    const handler = Meteor.subscribe('exports');
    Tracker.autorun(() => {
        this.state.set(IS_LOADING_STRING, !handler.ready());
    })
})

Template.AppPage.helpers({
    exports() {
        return ExportCollection.find({})
    }
})

Template.AppPage.events({
    'click #addTaskButton'() {
        Meteor.call('exports.remove', this._id)
    }
})