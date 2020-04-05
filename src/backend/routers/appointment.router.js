const aptMdl = require('../lib/appointment-model');
const RouterBase = require('../lib/router-base');
class BookAppointmentRouter extends RouterBase {
    constructor(req, res) {
        super();
    }
    prepareResponse() {

        this.router.post('/book', this.auth.verifyToken, (req, res) => {
            let date = new Date(req.body.fromDate);
            date = date.toISOString();
            date = date.split('T')[0];
            let findObj = {
                userId: req.userId,
                date: date
            }
            aptMdl.findOne(findObj, (err, apt) => {
                if (err) {
                    throw err
                }
                if (apt) {
                    let bookings = apt.bookings;
                    let foundBooking = bookings.find(item => item.fromDate == req.body.fromDate);
                    if (foundBooking) {
                        res.statusMessage = `The slot is already booked`;
                        res.status(500).send(res.statusMessage);
                        return;
                    }
                    bookings.push(req.body);
                    aptMdl.update({
                        _id: apt._id
                    }, {
                        bookings: bookings
                    }, (err, data) => {
                        if (err) throw err;
                        res.status(200).send(bookings);
                    });
                }
                if (!apt) {
                    let createObj = {
                        userId: req.userId,
                        date: date,
                        bookings: [req.body]
                    }
                    aptMdl.create(createObj, (err, data) => {
                        if (err) throw err;
                        res.status(200).send(data.bookings);
                    });
                }
            });

        });

        this.router.post('/list', this.auth.verifyToken, (req, res) => {
            let date = new Date(req.body.fromDate);
            date = date.toISOString();
            date = date.split('T')[0];
            let findObj = {
                userId: req.userId,
                date: date
            }
            aptMdl.findOne(findObj, (err, apt) => {
                if (err) {
                    throw err
                }
                if (apt) {
                    res.status(200).send(apt.bookings);
                }
                if (!apt) {
                    res.status(200).send([]);
                }
            });
        });
    }
}


module.exports = BookAppointmentRouter;