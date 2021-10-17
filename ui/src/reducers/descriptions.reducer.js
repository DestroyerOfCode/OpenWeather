import { descriptionsConstants } from '../_constants';

export function descriptions(state = [], action) {
    switch (action.type) {
        case descriptionsConstants.GET_DESCRIPTIONS:
            return action.descriptions;
        default:
            return state;
    }
}
