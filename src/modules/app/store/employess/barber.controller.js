const {
  getBarbers,
  gerBarbersAppointmentService,
} = require('./barber.service');

const index = async (req, res) => getBarbers(req, res);

const gerBarbersAppointment = async (req, res) =>
  gerBarbersAppointmentService(req, res);

module.exports = {
  index,
  gerBarbersAppointment,
};
