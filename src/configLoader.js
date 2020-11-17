import {getOr} from 'lodash/fp'
export const max_items_to_compare = getOr(10, "max_items_to_compare", window.__myapp)
export const startupTheme = getOr("defaultTheme", "startupTheme", window.__myapp)
export const amount_of_items_to_load = getOr(100, "amount_of_items_to_load", window.__myapp)
export const default_map_center = getOr([32.0, 34.0], "default_map_center", window.__myapp)
export const server_host_url = getOr("http://localhost:5000", "server_host_url", window.__myapp)
export const default_username = getOr(null, "default_username", window.__myapp)