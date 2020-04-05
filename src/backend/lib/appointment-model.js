let mongoose = require('mongoose');  
let AppointmentSchema = new mongoose.Schema({  
    userId: String,
    date: String,
    bookings: Array
});

let aptMdl = mongoose.model('cl_appointments', AppointmentSchema);

module.exports = aptMdl;