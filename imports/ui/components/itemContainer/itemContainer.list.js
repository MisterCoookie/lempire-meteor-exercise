/**
 * Created by: ELISABETH Nathanaël
 * Created at: 2023-27-01
 */

// Internal imports
import {EXPORT_STATE} from "../../../db/export.collection";

// Export all containers settings
export const EXPORT_ITEMS_CONTAINERS = {
    'SANDBOX': {
        title: 'List export Sandbox',
        amount: 10,
        backgroundColor: '#ff9359',
        justifyContent: 'justify-content-start',
        exportState: EXPORT_STATE.SANDBOX
    },
    'WAITING': {
        title: 'Waiting list',
        amount: 0,
        backgroundColor: '#3890CE',
        justifyContent: 'justify-content-center',
        exportState: EXPORT_STATE.WAITING
    },
    'EXPORTING': {
        title: 'Exporting',
        amount: 5,
        backgroundColor: '#40C47E',
        justifyContent: 'justify-content-center',
        exportState: EXPORT_STATE.EXPORTING
    },
    'VALIDATING': {
        title: 'Ended',
        amount: 0,
        backgroundColor: '#6CC539',
        justifyContent: 'justify-content-center',
        exportState: EXPORT_STATE.VALIDATING
    },
    'ENDED': {
        title: 'List exported',
        amount: -1,
        backgroundColor: '#6A59FF',
        justifyContent: 'justify-content-start',
        exportState: EXPORT_STATE.ENDED
    },
}
