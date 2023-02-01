export const MAX_ITEMS_PER_PAGE = process.env.MAX_ITEMS_PER_PAGE ? parseInt(process.env.MAX_ITEMS_PER_PAGE) : 10
export const MAX_IMAGES_PER_PAGE = process.env.MAX_IMAGES_PER_PAGE ? parseInt(process.env.MAX_IMAGES_PER_PAGE) : 20

const DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : "localhost"
const DB_NAME = process.env.DB_NAME ? process.env.DB_NAME : "osm"
const DB_USER = process.env.DB_USER ? process.env.DB_USER : "osm_sql"
const DB_PASS = process.env.DB_PASS ? process.env.DB_PASS : "osm!writer"
export const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`

export const WEBSOCKET_HOST = process.env.WEBSOCKET_HOST ? process.env.WEBSOCKET_HOST : "localhost"
export const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT ? parseInt(process.env.WEBSOCKET_PORT) : 5678