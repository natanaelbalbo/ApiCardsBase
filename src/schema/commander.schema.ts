import { Schema, model } from 'mongoose'

//"multiverseId": 149562 //0d2a4e1d-cc12-5675-8044-9a7bc7d60050 colorsIdentify:"w"
const commanderSchema = new Schema({
    id: Number,
    name: String,
    type : String
})
export default model ("Commander", commanderSchema);