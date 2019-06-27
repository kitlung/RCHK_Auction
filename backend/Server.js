const r    = require('rethinkdb')
const Pool = require('rethinkdb-pool')
const bodyParser  = require("body-parser");
const express = require('express');
var engines = require('consolidate');
var md5 = require('MD5');
var rest = require("./Rest.js")
var cronjob = require("./Cronjob.js")
const sockio = require('socket.io')
var io
const app = express()

function REST(){
    var self = this
    self.connectRethinkDB();
}

REST.prototype.connectRethinkDB = function(){
    var self = this
    
    var pool = Pool(r, {
        host:'rethinkdb',
        port:28015,
        db:'rchk_auction',
        authKey:''
    })

    pool.acquire(function(err,connection){
        if(err){
            self.stop(err);
        }else{
            self.configureExpress(connection)
        }
    })
}

REST.prototype.configureExpress = function(connection){
    var self = this
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
    app.set('views', __dirname + '/views');
    app.engine('html', engines.mustache);
    app.set('view engine', 'html');
    var router = express.Router();
    app.use('/api', router);

    self.startServer();

    var rest_router = new rest(router,connection,md5,io);
    var cronjob_router = new cronjob(router,connection,md5,io);

}

REST.prototype.startServer = function() {
    io = sockio.listen(app.listen(7082,function(){
        console.log("All right ! I am alive at Port 7082.");
    }))

    io.sockets.on('connection',function(socket){
        // console.log('connect to socket.')
    })
    
}

REST.prototype.stop = function(err) {
  console.log("ISSUE WITH DB \n" + err);
  process.exit(1);
}

new REST();