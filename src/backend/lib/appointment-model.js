let mongoose = require('mongoose');
let AppointmentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    bookings: Array
});

let aptMdl = mongoose.model('cl_appointments', AppointmentSchema);

module.exports = aptMdl;