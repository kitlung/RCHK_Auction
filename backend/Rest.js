const r = require('rethinkdb')
const multer = require('multer')
const fs = require('graceful-fs')
const path = require('path')

function REST_ROUTER(router,connection,md5,io) {
    var self = this;
    self.handleRoutes(router,connection,md5,io);
}

REST_ROUTER.prototype.handleRoutes = function(router,connection,md5,io) {
    const storage = multer.diskStorage({
        destination: 'uploads/',
        filename: function(req,file,callback){
            callback(null,Date.now() + '-' + file.originalname)
        }
    })
    
    const upload = multer({
        storage: storage
    }).array('photo')
      
    function handleError (err) {
        console.log(err)
    }

    item_info_subscription()
    bid_records_subscription()

    function item_info_subscription(){
        r.db('rchk_auction').table("item_information").changes().run(connection, function (error, cursor) {    
            if (error) { return handleError(error) }
            cursor.each(function(err, item){
                if (err) { return err }
                if(item.new_val && item.old_val){
                    io.emit('ITEM_UPDATE', item.new_val)
                }else if(item.new_val && !item.old_val){
                    io.emit('ITEM_INSERT', item.new_val)
                }else if(!item.new_val && item.old_val){
                    io.emit('ITEM_DELETE', item.old_val)
                }
            })
        })
    }

    function bid_records_subscription(){
        r.db('rchk_auction').table('bid_records').changes().run(connection, function (error, cursor) {
            if (error) { return handleError(error) }
            cursor.each(function(err, item){
                if (err) { return err }
                if(item.new_val && item.old_val){
                    io.emit('BID_UPDATE', item.new_val)
                }else if(item.new_val && !item.old_val){
                    io.emit('BID_INSERT', item.new_val)
                }else if(!item.new_val && item.old_val){
                    io.emit('BID_DELETE', item.old_val)
                }
            })
        })
    }

    router.get("/auction",function(req,res){
        res.json({"Message" : "Server Access"});
    });

    router.get('/auction/v1/items', getAllItems)
    router.get('/auction/v1/items/expire', getExpiredItems)
    router.get('/auction/v1/items/win/:userID', getWinItems)
    router.get('/auction/v1/items/sold/:userID', getSoldItems)
    router.get('/auction/v1/bid-record', getBidRecordWithUserIDItemID)
    router.get('/auction/v1/subscription/:userID', getSubscriptionList)
    router.get('/auction/v1/bidders', getNumOfBidders)
    router.get('/auction/v1/bid/:userID', getUserActivity)
    router.get('/auction/v1/image/:name', getImage)
    router.get('/auction/v1/conditions',getConditions)
    router.post('/auction/v1/image', uploadImage)
    router.post('/auction/v1/item', insertItem)
    router.put('/auction/v1/bid',placeBid)
    router.put('/auction/v1/subscription', toggleSubscription)
    router.put('/auction/v1/item', updateSoldItem)
    router.delete('/auction/v1/item', deleteItem)

/********************************/
/*
item_information:
    "id"                :   String              ,
    "created_at"        :   Date timezone + 8   ,
    "end_at"            :   Date timezone + 8   ,
    "created_by"        :   String              ,
    "description"       :   String              ,
    "name"              :   String              ,
    "price"             :   Int                 ,
    "price_interval"    :   Int                 ,
    "image_path"        :   String              ,
    "condition"         :   Object              , * not implemented

example:
{
    'created_at'        :   r.now().inTimezone('+08:00'),
    'end_at'            :   r.ISO8601('2019-04-30T09:30:00+08:00'),
    'created_by'        :   'lungc4',
    'description'       :   "Lorem",
    'name'              :   'Bee-Bot',
    'price'             :   10,
    'price_interval'    :   5
}


bid_records:
    "id"                :   String              ,
    "user_id"           :   String              ,
    'created_at'        :   Date timezone + 8   ,
    'item_id'           :   String (foreign)    ,
    'price'             :   Int                 ,

subscription:
    "id"                :   String              ,
    "user_id"           :   String              ,
    "item_id"           :   String              ,

win_records:
    "id"                :   String              ,
    'name'              :   String              ,
    'owner'             :   String              ,
    'winner'            :   String (foreign)    ,
    'received'          :   Boolean             ,
    'delivered'         :   Boolean             ,
*/
/********************************/



/********************************/
/* GET
/********************************/

    function getAllItems(req,res){
        r.db('rchk_auction').table('item_information')
            .filter(
                r.row('end_at').gt(r.now().inTimezone('+08:00'))
            )
            .run(connection, function(err, cursor){
                if (err) {
                    return handleError(error)
                }
                cursor.toArray(function(err,arr){
                    if(err){
                        return err
                    }else{
                        res.json({'Error': false, 'Request': arr})
                    }
                })
            })
    }

    function getExpiredItems(req,res){
        r.db('rchk_auction').table('item_information')
        .filter(
            r.row('end_at').lt(r.now().inTimezone('+08:00'))
        )
        .run(connection, function(err, cursor){
            if (err) {
                return handleError(error)
            }
            cursor.toArray(function(err,arr){
                if(err){
                    return err
                }else{
                    res.json({'Error': false, 'Request': arr})
                }
            })
        })
    }

    function getWinItems(req,res){
        if(req.params.userID){
            r.db('rchk_auction').table('win_records')
            .filter(
                r.row('winner').eq(req.params.userID)
                .and(
                    r.row('received').eq(false)
                    .or(r.row('delivered').eq(false))
                )
            )
            .run(connection, function(err,cursor){
                if (err) {
                    return handleError(error)
                }
                cursor.toArray(function(err,arr){
                    if(err){
                        return err
                    }else{
                        res.json({'Error': false, 'Request': arr})
                    }
                })    
            })
        }else{
            res.json({"Error": true, "Message": "User ID is missing."})
        }
    }

    function getSoldItems(req,res){
        if(req.params.userID){
            r.db('rchk_auction').table('win_records')
            .filter(
                r.row('owner').eq(req.params.userID)
                .and(
                    r.row('received').eq(false)
                    .or(r.row('delivered').eq(false))
                )
            )
            .run(connection, function(err,cursor){
                if (err) {
                    return handleError(error)
                }
                cursor.toArray(function(err,arr){
                    if(err){
                        return err
                    }else{
                        res.json({'Error': false, 'Request': arr})
                    }
                })    
            })
        }else{
            res.json({"Error": true, "Message": "User ID is missing."})
        }
    }

    function getBidRecordWithUserIDItemID(req,res){
        if (req.query.user_id && req.query.item_id){
            r.db('rchk_auction').table('bid_records')
                .filter({
                    'user_id': req.query.user_id,
                    'item_id': req.query.item_id
                })
                .orderBy(r.desc('created_at'))
                .limit(5)
                .run(connection, function(err, cursor){
                    if (err) {
                        return handleError(error)
                    }
                    cursor.toArray(function(err,arr){
                        if(err){
                            return err
                        }else{
                            res.json({'Error': false, 'Request': arr})
                        }
                    })
                })
        } else {
            res.status(502).json({'Error': true})
        }
    }

    function getSubscriptionList(req,res){
        r.db('rchk_auction').table('subscription')
            .filter({
                'user_id': req.params.userID
            })
            .pluck('item_id')
            .run(connection, function(err, cursor){
                if (err) {
                    return handleError(error)
                }
                cursor.toArray(function(err,arr){
                    if(err){
                        return err
                    }else{
                        res.json({'Error': false, 'Request': arr})
                    }
                })
            })
    }

    function getNumOfBidders(req,res){
        r.db('rchk_auction').table('bid_records')
            .eqJoin('item_id', r.db('rchk_auction').table('item_information'))
            .zip()
            .filter(r.row('end_at').gt(r.now().inTimezone('+08:00')))
            .pluck('item_id', 'user_id')
            .distinct()
            .group('item_id')
            .count()
            .run(connection, function(err, cursor){
            if (err) {
                return handleError(error)
            }
            cursor.toArray(function(err,arr){
                if(err){
                    return err
                }else{
                    res.json({'Error': false, 'Request': arr})
                }
            })
        })
    }

    function getUserActivity(req,res) {
        var userID = req.params.userID
        r.db('rchk_auction')
            .table('bid_records')
            .filter(r.row('user_id').eq(userID))
            .eqJoin("item_id",r.db('rchk_auction').table('item_information'))
            .without([
                {left: [ 'user_id', 'id']},
                {right: ['price','price_interval','winner','end_at','description','created_by','created_at']}
            ])
            .zip()
            .orderBy(r.desc('created_at'))
            .limit(7)
            .run(connection, function(err,cursor){
                if(err){
                    return handleError(error)
                }
                cursor.toArray(function(err,arr){
                    if(err){
                        return err
                    }else{
                        res.json({'Error': false, 'Request': arr})
                    }
                })
            })
    }

    function getImage(req,res) {
        var filePath = path.join(__dirname, "/uploads/" + req.params.name)
        if(fs.existsSync(filePath)){
            res.sendFile(filePath);
            return
        }
    }

    function getConditions(req,res){
        r.db('rchk_auction').table('conditions')
            .run(connection, function(err,cursor){
                if(err){
                    return handleError(error)
                }
                cursor.toArray(function(err,arr){
                    if(err){
                        return err
                    }else{
                        res.json({'Error': false, 'Request': arr})
                    }
                })
            })
    }
/********************************/
/* POST
/********************************/

function uploadImage(req,res){
    upload(req, res, function (err) {
        if(err){
            console.log(err)
            throw err
        }else{
            res.json({'Error': false, 'Request': req.files})
        }
    })
}

function insertItem(req,res){
    var item = req.body
    r.db('rchk_auction').table('item_information')
        .insert({
            'name': item.name,
            'price': parseInt(item.price),
            'price_interval': parseInt(item.price_interval),
            'winner': item.winner,
            'end_at': r.ISO8601(item.end_at + '+08:00'),
            'description': item.description,
            'created_by': item.created_by,
            'condition': item.condition,
            'imageList': item.imgList,
            'created_at': r.now().inTimezone('+08:00')
        })
        .run(connection, function(err){
            if(err){
                return handleError(error)
            }else{
                res.json({'Error': false})
            }
        })
}

/********************************/
/* PUT
/********************************/

    function placeBid(req,res){
        var user_id = req.body.user_id
        var item_id = req.body.item_id
        var price = parseInt(req.body.price)
        insertPlaceBidRecord(user_id, item_id, price)
            .then((result) => {
                var guaranteeKey = result
                increaseItemPrice(user_id, item_id, price)
                    .then(() => {
                        res.json({'Error': false})
                    })
                    .catch((err) => {
                        console.log(err)
                        removeBidRecord(guaranteeKey)
                            .then(() => {
                                res.json({'Error': true, "Message": "Unable to place your bid."})
                            })
                            .catch(err => {
                                res.json({'Error': true, "Message": "Unable to place your bid."})
                            })
                    })
            })
            .catch((err) => {
                res.json({'Error': true, "Message": err})
            })
    }

    function increaseItemPrice (user_id, item_id, price) {
        return new Promise((resolve,reject) => {
            r.db('rchk_auction').table('item_information')
                .filter(
                    r.row('id').eq(item_id)
                    .and(r.row('price').lt(price))
                    .and(r.row('end_at').gt(r.now().inTimezone('+08:00')))
                    .and(r.row('created_by').ne(user_id))
                )
                .update({
                    'price': parseInt(price)
                })
                .run(connection, function(err, cursor){
                if(err){
                    reject(err)
                }else{
                    if(cursor.replaced == 1){
                        resolve()
                    }else{
                        reject('You are not able to place your bid.')
                    }
                }
            })
        })
    }

    function insertPlaceBidRecord (user_id, item_id, price) {
        return new Promise((resolve, reject) => {
            r.db('rchk_auction').table('bid_records')
                .insert({
                    'user_id': user_id,
                    'created_at': r.now().inTimezone('+08:00'),
                    'item_id': item_id,
                    'price': price
                })
                .run(connection, function(err,cursor){
                    if(err){
                        reject(err)
                    }else{
                        if(cursor.inserted == 1){
                            resolve(cursor.generated_keys[0])
                        }else{
                            reject('Unable to insert your bid record.')
                        }
                    }
                })
        })
    }

    function removeBidRecord (guaranteeKey) {
        return new Promise((resolve, reject) => {
            r.db('rchk_auction').table('bid_records')
                .get(guaranteeKey)
                .delete()
                .run(connection, function(err){
                    if(err){
                        reject(err)
                    }else{
                        resolve()
                    }
                })
        })
    }

    function toggleSubscription (req,res) {
        r.db('rchk_auction').table('subscription')
            .filter({
                "item_id": req.body.itemID,
                "user_id": req.body.userID
            })
            .isEmpty()
            .do(empty => r.branch(
                empty,
                r.db('rchk_auction').table('subscription').insert({
                    "item_id": req.body.itemID,
                    "user_id": req.body.userID
                }),
                r.db('rchk_auction').table('subscription').filter({
                    "item_id": req.body.itemID,
                    "user_id": req.body.userID
                }).delete(),
            ))
            .run(connection, function(err){
                if(err){
                    return handleError(error)
                }else{
                    res.json({'Error': false})
                }
            })
    }

    function updateSoldItem (req,res){
        var id = req.body.id
        if(req.body.delivered){
            var updateItem = {'delivered' : req.body.delivered}
        }else if(req.body.received){
            var updateItem = {'received' : req.body.received}
        }
        r.db('rchk_auction').table('win_records')
            .get(id)
            .update(updateItem)
            .run(connection, function(err){
                if(err){
                    return handleError(error)
                }else{
                    res.json({'Error': false})
                }
            })
    }

    /********************************/
    /* DELETE
    /********************************/

    function deleteItem (req,res){
        r.db('rchk_auction').table('item_information')
            .get(req.body.id)
            .delete()
            .run(connection, function(err){
                if(err){
                    return handleError(error)
                }else{
                    res.json({'Error': false})
                }
            })
    }

}
module.exports = REST_ROUTER;
