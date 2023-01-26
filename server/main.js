import { Meteor } from 'meteor/meteor';
import { ExportCollection } from "../imports/db/export.collection.js";
import '../imports/api/export.methods.js'
import '../imports/api/export.publication.js'

Meteor.startup(() => {
    console.log(ExportCollection.find().count())
    if (ExportCollection.find().count() === 1) {
        console.log('There is nothing')

        ExportCollection.insert({
            name: 'randomExport2.png',
            state: 'sandbox',
            percent: 0
        })
    }

    Meteor.setInterval(() => {
        Meteor.call('exports.progressExporting')
    }, 1000)
});
