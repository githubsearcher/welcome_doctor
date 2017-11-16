'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './guest.events';

var GuestSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  profilePicture: String,
  active: Boolean,
  tagId: Number,
  tagUUID: String,
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
