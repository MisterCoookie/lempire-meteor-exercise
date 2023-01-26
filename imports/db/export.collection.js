/**
 * Created by: ELISABETH Nathanaël
 * Created at: 2023-27-01
 */

// Meteor imports
import { Mongo } from 'meteor/mongo';

// Mongo Collection
export const ExportCollection = new Mongo.Collection('tasks');

// A simple fonction to get a random url from the url list
export function getRandomFinalUrl() {
    const random = Math.floor(Math.random() * 4)
    return EXPORT_FINAL_URLS[random]
}

// Urls who will be chosen as fake url
export const EXPORT_FINAL_URLS = [
    'https://www.lempire.com/',
    'https://www.lemlist.com/',
    'https://www.lemverse.com/',
    'https://www.lemstash.com/'
]

// Export state list
export const EXPORT_STATE = {
    'SANDBOX': 'SANDBOX',
    'WAITING': 'WAITING',
    'EXPORTING': 'EXPORTING',
    'VALIDATING': 'VALIDATING',
    'ENDED': 'ENDED'
}
