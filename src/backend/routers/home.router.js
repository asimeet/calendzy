const RouterBase = require('../lib/router-base');
class HomeRouter extends RouterBase {
    constructor(req, res) {
        super();
    }
    prepareResponse() {

        this.router.get('/',this.auth.verifyToken,(req, res) => {
            this.userMdl.findOne({_id: req.userId}, (err, data)=>{
                let userName = data.name;
                res.render('home',{
                    userName: userName.toUpperCase()
                }) 
            });
        });
    }
}


module.exports = HomeRouter;