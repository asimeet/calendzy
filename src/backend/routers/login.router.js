const RouterBase = require('../lib/router-base');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
class LoginRouter extends RouterBase {
    constructor(req, res) {
        super();
    }
    prepareResponse() {
        this.router.post('/sign-up', (req, res) => {

            let findCond = {
                $or: [{
                    email: req.body.email
                }, {
                    name: req.body.user
                }]
            };
            this.userMdl.findOne(findCond, (err, user) => {
                if (err) {
                    res.statusMessage = `Error in finding user`;
                    res.sendStatus(500);
                    return;
                }
                if(user){
                    res.statusMessage = `User is already registered`;
                    res.sendStatus(500);
                    return;
                }
                if (!user) {
                    let hashedPassword = bcrypt.hashSync(req.body.password, 8);
                    this.userMdl.create({
                            name: req.body.user,
                            email: req.body.email,
                            password: hashedPassword
                        },
                        (err, user) => {
                            if (err) res.status(500).send("There was a problem registering the user.")
                            // create a token
                            let token = jwt.sign({
                                id: user._id
                            }, this.config.secret, {
                                expiresIn: 86400 // expires in 24 hours
                            });
                            res.status(200).send(token);
                        });
                }
            });

        });
        this.router.post('/sign-in', (req, res) => {
            let findCond = {
                $or: [{
                        email: req.body.user
                    },
                    {
                        name: req.body.user
                    }
                ]
            }
            this.userMdl.findOne(findCond, (err, user) => {
                if (err) return res.status(500).send('Error on the server.');
                if (!user) return res.status(404).send('No user found.');

                var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
                if (!passwordIsValid) return res.status(401).send({
                    auth: false,
                    token: null
                });

                var token = jwt.sign({
                    id: user._id
                }, this.config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

                res.status(200).send(token);
            });

        });
        this.router.get('/', function (req, res) {
            res.render('login');
        });
    }
}


module.exports = LoginRouter;