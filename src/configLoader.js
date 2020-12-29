
import lightBlue from '@material-ui/core/colors/lightBlue';

import {getOr} from 'lodash/fp'
export const max_items_to_compare = getOr(10, "max_items_to_compare", window.__myapp)
export const startupTheme = getOr("defaultTheme", "startupTheme", window.__myapp)
export const amount_of_items_to_load = getOr(100, "amount_of_items_to_load", window.__myapp)
export const default_map_center = getOr([32.0, 34.0], "default_map_center", window.__myapp)
export const server_host_url = getOr("http://localhost:5000", "server_host_url", window.__myapp)
export const default_username = getOr(null, "default_username", window.__myapp)
export const default_locale = getOr(null, "default_locale", window.__myapp)
export const reveal_geolayer_zoom_threshold = getOr(15, "reveal_geolayer_zoom_threshold", window.__myapp)
export const reveal_markerlayer_zoom_threshold = getOr(15, "reveal_markerlayer_zoom_threshold", window.__myapp)
export const use_redux_toolkit = getOr(false, "use_redux_toolkit", window.__myapp)
export const logged_in = getOr(false, "logged_in", window.__myapp)
export const active_threshold = getOr(false, "active_threshold", window.__myapp)
export const max_map_zoom = getOr(false, "max_map_zoom", window.__myapp)
export const task_colors = [lightBlue[100], lightBlue[300], lightBlue[500], lightBlue[700], lightBlue[900]]