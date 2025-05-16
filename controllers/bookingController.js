// controllers/bookingController.js
const Booking = require('../models/bookingModel');
const Event = require('../models/eventsModel');
const ApiError = require('../utils/apiError');
const responseWrapper = require('../utils/responseWrapper');
const responseTypes = require('../utils/responseTypes');

const bookEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.userId;

    // check if already booked
    const alreadyBooked = await Booking.findOne({ user: userId, event: eventId });
    if (alreadyBooked) {
      return next(new ApiError('You have already booked this event', 400));
    }

    const booking = await Booking.create({ user: userId, event: eventId });

    return responseWrapper(res, responseTypes.CREATED, 'Event booked successfully', booking);
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

module.exports = { bookEvent };
