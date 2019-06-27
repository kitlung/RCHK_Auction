const r = require('rethinkdb')
const cron = require('cron')
const nodemailer = require('nodemailer')

function CRONJOB_ROUTER(router,connection,md5,io) {
    var self = this;
    self.handleRoutes(router,connection,md5,io);
}

CRONJOB_ROUTER.prototype.handleRoutes = function(router,connection,md5,io){
    var transporter = nodemailer.createTransport({
        host: EMAIL_SERVER,
        port: '25',
    });

    function handleError (err) {
        console.log(err)
    }

    var getWinner = cron.job("*/60 * * * * *", getWinnerFunction)
    var removeExpired = cron.job("0 7 * * *", removeExpiredFunction)

    /********************************/
    /* Get Winner
    /********************************/

    function getWinnerFunction() {
        r.db('rchk_auction').table('item_information')
            .filter(
                r.row('end_at').lt(r.now().inTimezone('+08:00'))
                .and(r.row('winner').eq(''))
            )
            .run(connection)
            .then(cursor => {
                return cursor.toArray()
            })
            .then(itemArr => {
                if(itemArr.length > 0){
                    itemArr.map(item => {
                        getWinnerID(item)
                        removeSubsciption(item.id)
                    })
                }
            })
            .catch(err => {
                handleError(err)
            })
    }

    function getWinnerID (item) {
        r.db('rchk_auction').table('bid_records')
            .eqJoin("item_id",r.db('rchk_auction').table('item_information'))
            .without([
                {left: ['id']},
                {right: ['created_at','created_by','description','id','name','price','price_interval','winner']}
            ])
            .zip()
            .filter(
                r.row('item_id').eq(item.id)
                .and(r.row('created_at').le(r.row('end_at')))
            )
            .orderBy(r.desc('created_at'), r.desc('price'))
            .limit(1)
            .pluck('user_id')
            .run(connection)
            .then(cursor => {
                return cursor.toArray()
            })
            .then(user => {
                if(user.length == 1){
                    announceWinner(item,user[0].user_id)
                }
            })
            .catch(err => {
                handleError(err)
            })
    }

    function announceWinner (item, userID){
        Promise.all([
            updateWinner(item.id, userID),
            insertWinner(item, userID)
        ])
        .then(res => {
            sendMailToWinner(item, userID)
            sendMailToOwner(item, userID)
        })
        .catch(err => {
            console.log('err')
        })
    }

    function sendMailToWinner (item, userID){
        var mailOptions = {
            from: 'RCHK Auction <auction@rchk.edu.hk>',
            to: userID + '@rchk.edu.hk',
            subject: 'Auction ends',
            html: `
            <div style="width: 640px; font-family: 'Source Sans Pro', sans-serif;">
                <div style="width: 640px;">
                    <h2 style="font-weight: normal; color: #2C3E50; text-transform: uppercase; text-align: center; padding: 20px; letter-spacing: 1px;">Congratulation</h2>
                </div>
                <div style="width: 90%; padding: 10px 30px 30px 30px; font-size: 13px; color: #2C3E50">
                    <p>Congratulations, you are the highest bidder!</p>
                    <p style="display: inline-block; padding-right: 5px;">You won RCHK Auction item #` + item.id + ` <b>` + item.name + `</b>.</p><br>
                    <p style="display: inline-block; padding-right: 5px;">Please send an email to the owner ( ` + item.created_by + `@rchk.edu.hk ) and schedule a pickup time.</p><br>
                    <p style="display: inline-block; padding-right: 5px;">Please don't forget to mark the item as received after you have picked it up.</p>
                </div>
                <div style="width: 600px; background: #efefef; padding:20px">
                    <p style="color: #6a6a6a;"><strong> Please do not reply to this email since it is from an automated mailbox. We are unable to respond to your queries via return email.</strong></p>
                    <p style="color: #6a6a6a;"><strong> If you have any enquiries, please contact Red Door .</strong></p>
                </div>
            </div>
            `
        }
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }
        });
    }

    function sendMailToOwner(item, userID){
        var mailOptions = {
            from: 'RCHK Auction <auction@rchk.edu.hk>',
            to: item.created_by + '@rchk.edu.hk',
            subject: 'Auction ends',
            html: `
            <div style="width: 640px; font-family: 'Source Sans Pro', sans-serif;">
                <div style="width: 640px;">
                    <h2 style="font-weight: normal; color: #2C3E50; text-transform: uppercase; text-align: center; padding: 20px; letter-spacing: 1px;">Congratulation</h2>
                </div>
                <div style="width: 90%; padding: 10px 30px 30px 30px; font-size: 13px; color: #2C3E50">
                    <p>Congratulations, your item has been sold!</p>
                    <p style="display: inline-block; padding-right: 5px;">Your RCHK Auction item #` + item.id + ` <b>` + item.name + `</b> was sold at $` + item.price + `.</p><br>
                    <p style="display: inline-block; padding-right: 5px;">Please send an email to the winner ( ` + userID + `@rchk.edu.hk ) and schedule a pickup time.</p><br>
                    <p style="display: inline-block; padding-right: 5px;">Please don't forget to mark the item as delivered after you have given it to the winner.</p>
                </div>
                <div style="width: 600px; background: #efefef; padding:20px">
                    <p style="color: #6a6a6a;"><strong> Please do not reply to this email since it is from an automated mailbox. We are unable to respond to your queries via return email.</strong></p>
                    <p style="color: #6a6a6a;"><strong> If you have any enquiries, please contact Red Door .</strong></p>
                </div>
            </div>
            `
        }
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }
        });

    }

    function updateWinner(itemID, userID) {
        return new Promise((resolve,reject) => {
            r.db('rchk_auction').table('item_information')
                .get(itemID)
                .update({
                    "winner": userID
                })
                .run(connection)
                .then(() => {
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    function insertWinner(item, userID) {
        return new Promise((resolve,reject) => {
            r.db('rchk_auction').table('win_records')
            .insert({
                "delivered": false,
                "id":  item.id,
                "name":  item.name,
                "owner":  item.created_by,
                "price": item.price,
                "received": false ,
                "winner":  userID
            })
            .run(connection)
            .then(() => {
                resolve()
            })
            .catch(err => {
                reject()
            })
        })
    }

    function removeSubsciption(itemId) {
        r.db('rchk_auction').table('subscription')
            .filter(r.row('item_id').eq(itemId))
            .delete()
            .run(connection)
            .then(() => {
            })
    }

    /********************************/
    /* Remove Expired
    /********************************/

    function removeExpiredFunction () {
        r.db('rchk_auction').table('item_information')
            .filter(
                r.row('end_at').lt(r.now().sub(3*24*60*60))
            )
            .delete()
            .run(connection)
            .then(() => {
            })
    }

    getWinner.start()
    removeExpired.start()

}

module.exports = CRONJOB_ROUTER;
