const Event = require('../models/eventsModel');
const ApiError = require('../utils/apiError');
const responseWrapper = require('../utils/responseWrapper');
const responseTypes = require('../utils/responseTypes');

// only admin do these



//create event
const createEvent = async (req, res, next) => {
  try {
    const event = new Event(req.body);
    await event.save();
    return responseWrapper(res, responseTypes.CREATED, 'Event created successfully', event);
  } catch (error) {
    return next(new ApiError(error.message, responseTypes.BAD_REQUEST.code));
  }
};

//get all events
const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    return responseWrapper(res, responseTypes.SUCCESS, 'Events fetched successfully', events);
  } catch (error) {
    return next(new ApiError(error.message, responseTypes.SERVER_ERROR.code));
  }
};

//update by id
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) {
      return next(new ApiError('Event not found', responseTypes.NOT_FOUND.code));
    }
    return responseWrapper(res, responseTypes.SUCCESS, 'Event updated successfully', event);
  } catch (error) {
    return next(new ApiError(error.message, responseTypes.BAD_REQUEST.code));
  }
};

//delete by id
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return next(new ApiError('Event not found', responseTypes.NOT_FOUND.code));
    }
    return responseWrapper(res, responseTypes.SUCCESS, 'Event deleted successfully');
  } catch (error) {
    return next(new ApiError(error.message, responseTypes.SERVER_ERROR.code));
  }
};

module.exports = { createEvent, getEvents, updateEvent, deleteEvent };
