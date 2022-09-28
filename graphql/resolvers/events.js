const Event = require(`../../models/event`);
const User = require(`../../models/user`);
const { dateToString } = require("../../helpers/date");
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  createEvent: async (args,req) => {
    // const event = {
    //   _id: Math.random().toString(),
    //   title: args.eventInput.title,
    //   description: args.eventInput.description,
    //   price: +args.eventInput.price,
    //   date: args.eventInput.date,
    // };
    if(!req.isAuth){
        throw new Error('Unauthenticared request');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });
    let createdEvent;
    // .save() method is provide by mongoose to store data in mongoDB
    try {
      const result = await event.save();

      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);
      // console.log(result);
      // // return result;
      // return { ...result._doc, _id: result.id };

      if (!creator) {
        throw new Error("User not found");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
};
