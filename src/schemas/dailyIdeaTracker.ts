import { Schema, model } from "mongoose";
import { formatDateToMMDDYYYY } from "../functions";

const dailyTrackerSchema = new Schema({
    userId: { required: true, type: String },
    messagedToday: { required: true, type: Boolean, default: false },
    date: {
      type: String,
      default: function () {
        // Format the current date to mm-dd-yyyy
        return formatDateToMMDDYYYY(new Date());
      },
    },
  });

// function to format the date to mm-dd-yyyy


const TrackerModel  = model("tracker", dailyTrackerSchema)

module.exports = TrackerModel;