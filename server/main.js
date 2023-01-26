// Meteor imports
import { Meteor } from 'meteor/meteor';

// Internal imports
import '../imports/api/export.methods.js'
import '../imports/api/export.publication.js'

Meteor.startup(() => {

    // I set up a fun interval to simulate the management of the export by the server
    // So every seconds the server check to see if any export items need treatment.
    Meteor.setInterval(() => {
        Meteor.call('exports.progressExporting')
    }, 1000)
});
