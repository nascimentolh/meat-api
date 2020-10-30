import * as mongoose from 'mongoose'

export interface MenuItem extends mongoose.Document {
  name: String
  price: Number
}

export interface RestaurantDocument extends mongoose.Document {
  name: String
  menu: MenuItem[]
}

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
})

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  menu: {
    type: [menuSchema],
    required: false,
    select: false,
    default: [],
  },
})

export const Restaurant = mongoose.model<RestaurantDocument>(
  'Restaurant',
  restaurantSchema
)
