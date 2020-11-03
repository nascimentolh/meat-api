import * as mongoose from 'mongoose'
import { UserDocument } from '../users/users.model'
import { RestaurantDocument } from '../restaurants/restaurants.model'

export interface ReviewDocument extends mongoose.Document {
  date: Date
  rating: Number
  comments: String
  restaurant: mongoose.Types.ObjectId | RestaurantDocument
  user: mongoose.Types.ObjectId | UserDocument
}

const reviewSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comments: {
    type: String,
    required: true,
    maxlength: 500,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

const Review = mongoose.model<ReviewDocument>('Review', reviewSchema)
