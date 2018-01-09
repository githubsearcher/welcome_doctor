'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './guest.events';

var GuestSchema = new mongoose.Schema({
  title: String,
  name: String,
  email: String,
  phone: String,
  empNo: String,
  grade: String,
  designation: String,
  location: String,
  profilePicture: String,
  active: Boolean,
  tagId: Number,
  lastTap: {
    dateTapped: Number,
    screen: String
  },
  taps: [{
    dateTapped: Number,
    screen: String
  }],
  visible: {type: Boolean, default: true}
}, {
  timestamps: true
});

registerEvents(GuestSchema);
export default mongoose.model('Guest', GuestSchema);
