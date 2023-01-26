/**
 * Created by: ELISABETH Nathanaël
 * Created at: 2023-27-01
 */

// Internal imports
import { ExportCollection } from "../../../db/export.collection";

// Blaze template import
import './itemContainer.component.html'

// Template setup
Template.exportItemsContainer.helpers({
    getExportItems() {
        return ExportCollection.find({state: this.itemContainerData.exportState });
    },
    getExportItemsCounts() {
        return ExportCollection.find({state: this.itemContainerData.exportState }).count();
    },
    amount() {
        return this.itemContainerData.amount == -1 ? ExportCollection.find({state: this.itemContainerData.exportState }).count() : this.itemContainerData.amount
    }
})
