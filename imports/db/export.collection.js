import { Mongo } from 'meteor/mongo';

export const ExportCollection = new Mongo.Collection('tasks');


export function getRandomFinalUrl() {
    const random = Math.floor(Math.random() * 4)
    return EXPORT_FINAL_URLS[random]
}

export const EXPORT_FINAL_URLS = [
    'https://www.lempire.com/',
    'https://www.lemlist.com/',
    'https://www.lemverse.com/',
    'https://www.lemstash.com/'
]

export const EXPORT_STATE = {
    'SANDBOX': 'SANDBOX',
    'WAITING': 'WAITING',
    'EXPORTING': 'EXPORTING',
    'VALIDATING': 'VALIDATING',
    'ENDED': 'ENDED'
}
