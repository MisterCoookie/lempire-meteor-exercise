import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './export.component.html'

const PERCENT_LOADING_STRING = 'PERCENT_LOADING_STRING'

Template.exportComponent.onCreated(function exportComponentOnCreated() {
    this.state = new ReactiveDict();
    this.state.set(PERCENT_LOADING_STRING, 0)

    const interval = setInterval(() => {
        const percent = this.state.get(PERCENT_LOADING_STRING) + 5
        this.state.set(PERCENT_LOADING_STRING, percent)
        if (percent >= 100) {
           clearInterval(interval)
        }
    }, 1000)
})


Template.exportComponent.helpers({
    percent() {
        const instance = Template.instance();
        return instance.state.get(PERCENT_LOADING_STRING) + '%'
    }
})

Template.exportComponent.events({
    'click #deleteExportButton'() {
        Meteor.call('exports.remove', this._id)
    }
})