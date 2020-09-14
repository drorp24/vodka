import {getOr} from 'lodash/fp'
export const max_items_to_compare = getOr(10, "max_items_to_compare", window.__myapp)
export const startupTheme = getOr("defaultTheme", "startupTheme", window.__myapp)