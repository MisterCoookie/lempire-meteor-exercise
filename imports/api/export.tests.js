/**
 * Created by: ELISABETH Nathanaël
 * Created at: 2023-27-01
 */

// Meteor imports
import {Meteor} from "meteor/meteor";
import { mockMethodCall } from 'meteor/quave:testing';
import { assert } from 'chai';

// External imports
import {faker} from "@faker-js/faker";

// Internal imports
import {EXPORT_STATE, ExportCollection} from "../db/export.collection";
import './export.methods.js'

// Tests
if (Meteor.isServer) {
    // Tests for exports
   describe('Exports', () => {
       // Test methods
       describe('methods', () => {
           let exportId;

           beforeEach(() => {
               ExportCollection.remove({})
               exportId = ExportCollection.insert({
                   name: faker.system.commonFileName(), // using fake to simulate file name
                   state: EXPORT_STATE.SANDBOX,
                   percent: 0,
                   date: new Date(),
               })
           });

           // Verify we can insert a new Export item
           it('can insert new export', () => {
               mockMethodCall('exports.insert')
               assert.equal(ExportCollection.find({}).count(), 2);
           })

           // Verify we can delete an Export item
           it('can delete export', () => {
               mockMethodCall('exports.remove', exportId)
               assert.equal(ExportCollection.find({}).count(), 0);
           })

           // Verify we can flush all exporting items in sandbox in the waiting or exporting list
           it('can flush export items to exporting state', () => {
               const randomExportCount = Math.floor(Math.random() * 9)

               for(let i = 0; i < randomExportCount; i++) {
                   exportId = ExportCollection.insert({
                       name: faker.system.commonFileName(), // using fake to simulate file name
                       state: EXPORT_STATE.SANDBOX,
                       percent: 0,
                       date: new Date(),
                   })
               }

               mockMethodCall('exports.flushToExport')

               // The exporting list can't be bigger than 5
               // So we must test if the remaining go in waiting list like it should
               if (randomExportCount + 1 > 5) {
                   assert.equal(ExportCollection.find({state: EXPORT_STATE.EXPORTING}).count(), 5);
                   assert.equal(ExportCollection.find({state: EXPORT_STATE.WAITING}).count(), (randomExportCount + 1) - 5);
               } else {
                   assert.equal(ExportCollection.find({state: EXPORT_STATE.EXPORTING}).count(), randomExportCount + 1);
                   assert.equal(ExportCollection.find({state: EXPORT_STATE.WAITING}).count(), 0);
               }
           })

           // Verify we can update percent of all export items at each time the process go
           it('can do update percent for each exporting item', () => {
               const randomExportCount = Math.floor(Math.random() * 5)

               for(let i = 0; i < randomExportCount; i++) {
                   exportId = ExportCollection.insert({
                       name: faker.system.commonFileName(), // using fake to simulate file name
                       state: EXPORT_STATE.EXPORTING,
                       percent: 0,
                       date: new Date(),
                   })
               }

               mockMethodCall('exports.progressExporting')

               const exportsItems = ExportCollection.find({state: EXPORT_STATE.EXPORTING}).fetch();

               assert.equal(exportsItems.length, randomExportCount);
               for( const exportItem of exportsItems) {
                   assert.equal(exportItem.percent, 5);
               }
           })

           // Verify when export items are updated that if the percent go to 100 then they are pushed to the Validating list
           it('can do update percent and pass it in validate', () => {

               for(let i = 0; i < 3; i++) {
                   exportId = ExportCollection.insert({
                       name: faker.system.commonFileName(), // using fake to simulate file name
                       state: EXPORT_STATE.EXPORTING,
                       percent: 95,
                       date: new Date(),
                   })
               }

               mockMethodCall('exports.progressExporting')

               assert.equal(ExportCollection.find({state: EXPORT_STATE.EXPORTING}).count(), 0);

               const exportsItems = ExportCollection.find({state: EXPORT_STATE.VALIDATING}).fetch();
               assert.equal(exportsItems.length, 3);

               for( const exportItem of exportsItems) {
                   assert.equal(exportItem.percent, 100);
                   assert.equal(exportItem.state, EXPORT_STATE.VALIDATING);
               }
           })

           // Verify when export items are updated that if the percent go to 100 then they are pushed to the Validating list
           // And if waiting list remain then we push them in the exporting list
           it('can do update percent, pass it in validate and fill the exporting list with the remaining in the waiting list', () => {

               for(let i = 0; i < 3; i++) {
                   exportId = ExportCollection.insert({
                       name: faker.system.commonFileName(), // using fake to simulate file name
                       state: EXPORT_STATE.WAITING,
                       percent: 0,
                       date: new Date(),
                   })
               }

               for(let i = 0; i < 5; i++) {
                   exportId = ExportCollection.insert({
                       name: faker.system.commonFileName(), // using fake to simulate file name
                       state: EXPORT_STATE.EXPORTING,
                       percent: 95,
                       date: new Date(),
                   })
               }

               mockMethodCall('exports.progressExporting')

               assert.equal(ExportCollection.find({state: EXPORT_STATE.WAITING}).count(), 0);

               const exportsExportingItems = ExportCollection.find({state: EXPORT_STATE.EXPORTING}).fetch();
               assert.equal(exportsExportingItems.length, 3);

               for( const exportExportingItem of exportsExportingItems) {
                   assert.equal(exportExportingItem.percent, 0);
                   assert.equal(exportExportingItem.state, EXPORT_STATE.EXPORTING);
               }

               const exportsValidatingItems = ExportCollection.find({state: EXPORT_STATE.VALIDATING}).fetch();
               assert.equal(exportsValidatingItems.length, 5);

               for( const exportValidatingItem of exportsValidatingItems) {
                   assert.equal(exportValidatingItem.percent, 100);
                   assert.equal(exportValidatingItem.state, EXPORT_STATE.VALIDATING);
               }
           })

           // Verify we can flush the validated export in the Ended list
           it('can do flush to end', () => {
               for(let i = 0; i < 5; i++) {
                   exportId = ExportCollection.insert({
                       name: faker.system.commonFileName(), // using fake to simulate file name
                       state: EXPORT_STATE.VALIDATING,
                       percent: 100,
                       date: new Date(),
                   })
               }

               mockMethodCall('exports.flushToEnd')

               assert.equal(ExportCollection.find({state: EXPORT_STATE.VALIDATING}).count(), 0);

               const exportsValidatingItems = ExportCollection.find({state: EXPORT_STATE.ENDED}).fetch();
               assert.equal(exportsValidatingItems.length, 5);
           })
       });
   })
}
