var express = require('express');
var hostname = 'localhost'; 
var port = 3000; 
var mongoose = require('mongoose'); 
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
var urlmongo = "mongodb://ul0msc5xygeklatzuba6:G8IH6ZO7FTdVusqpZekg@bft0fdz443tmcqz-mongodb.services.clever-cloud.com:27017/bft0fdz443tmcqz"; 
mongoose.connect(urlmongo, options);
var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
db.once('open', function (){
    console.log("Connexion à la base OK"); 
}); 
var app = express(); 
var bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var eventSchema = mongoose.Schema({
    title: String, 
    description: String, 
    freeText: String, 
    pictureURL: String,
    email: String,
    CreatorUid: String,
    place: String,  
    location: {_id:false, latitude: Number , longitude: Number},
    date : Date,
    category : String,
    timeStart : String, 
    timeEnd : String,
    address: String
 
}); 

var Event = mongoose.model('Event', eventSchema); 
var myRouter = express.Router(); 
myRouter.route('/')
.all(function(req,res){ 
    res.json({message : "Bienvenue sur notre API My Events ", methode : req.method});
});
// evenements
myRouter.route('/events')
.get(function(req,res){ 
	Event.find(function(err, events){
        if (err){
            res.send(err); 
        }
        res.json(events);  
    }); 
})
.post(function(req,res){
      var event = new Event();
      event.title = req.body.title;
      event.description = req.body.description;
      event.freeText = req.body.freeText;
      event.pictureURL = req.body.pictureURL; 
      event.email = req.body.email; 
      event.CreatorUid = req.body.CreatorUid; 
      event.place = req.body.place;
      event.location = req.body.location;
      event.date = req.body.date; 
      event.category = req.body.category; 
      event.timeStart = req.body.timeStart; 
      event.timeEnd = req.body.timeEnd; 
      event.address = req.body.address; 

      event.save(function(err){
        if(err){
          res.send(err);
        }
        res.json({message : 'Bravo, ton evenement est maintenant stockée en base de données'});
      }); 
}); 
myRouter.route('/events/org/:org_id')
.get(function(req,res){ 
    Event.findById(req.params.CreatorUid, function(err, event) {
            if (err)
                res.send(err);
            res.json(event);
        });
});

myRouter.route('/events/:event_id')
.get(function(req,res){ 
    Event.findById(req.params.event_id, function(err, event) {
            if (err)
                res.send(err);
            res.json(event);
        });
})
.put(function(req,res){ 
    Event.findById(req.params.event_id, function(err, event) {
        if (err){
            res.send(err);
        }
        event.title = req.body.title;
        event.description = req.body.description;
        event.freeText = req.body.freeText;
        event.pictureURL = req.body.pictureURL; 
        event.email = req.body.email; 
        event.CreatorUid = req.body.CreatorUid; 
        event.place = req.body.place;
        event.location = req.body.location;
        event.date = req.body.date; 
        event.category = req.body.category; 
        event.timeStart = req.body.timeStart; 
        event.timeEnd = req.body.timeEnd; 
        event.address = req.body.address; 
        event.save(function(err){
            if(err){
                res.send(err);
            }
            res.json({message : 'Bravo, mise à jour des données OK'});
        });                
    });
})
.delete(function(req,res){ 

    Event.remove({_id: req.params.event_id}, function(err, event){
        if (err){
            res.send(err); 
        }
        res.json({message:"Bravo, event supprimée"}); 
    }); 
    
});

// reservation
var ReservationSchema = mongoose.Schema({
    eventUid: String, 
    userUid: String, 
    statut: String
});

var Reservation = mongoose.model('Reservation', ReservationSchema); 

myRouter.route('/reservations')
.get(function(req,res){ 
	Reservation.find(function(err, reservations){
        if (err){
            res.send(err); 
        }
        res.json(reservations);  
    }); 
})
.post(function(req,res){
      var reservation = new Reservation();
      reservation.eventUid = req.body.eventUid;
      reservation.userUid = req.body.userUid;
      reservation.statut = req.body.statut;

     reservation.save(function(err){
        if(err){
          res.send(err);
        }
        res.json({message : 'Bravo, ton evenement est maintenant stockée en base de données'});
      }); 
}); 

myRouter.route('/reservation/:reservation_id')
.get(function(req,res){ 
    var reservationUser = Reservation.find({"userUid": req.params.reservation_id }, {"_id": 0, userUid: 0,statut: 0, __v: 0});
    console.log(reservationUser);
    var peopleArray = Object.values(reservationUser)
    var objarray = []
    for(i=0;i<reservationUser.length;i++)
    {
        objarray[i] = mongoose.Types.ObjectId(reservationUser[i]);
    }
    Event.find({_id: {$in:  objarray }, function(err, events){
        if (err){
            res.send(err); 
        }
        res.json(events);  
    }); 
    
    // Reservation.find({"userUid": req.params.reservation_id }, {"_id": 0, userUid: 0,statut: 0, __v: 0}, function(err, reservation) {
    //             if (err)
    //                 res.send(err);
    //             res.json(reservation);
    // });
})
.put(function(req,res){ 
    Reservation.findById(req.params.reservation_id, function(err, reservation) {
        if (err){
            res.send(err);
        }
        reservation.eventUid = req.body.eventUid;
        reservation.userUid = req.body.userUid;
        reservation.statut = req.body.statut;
        reservation.save(function(err){
            if(err){
                res.send(err);
            }
            res.json({message : 'Bravo, mise à jour des données OK'});
        });                
    });
})
.delete(function(req,res){ 

    Reservation.remove({_id: req.params.reservation_id}, function(err, reservation){
        if (err){
            res.send(err); 
        }
        res.json({message:"Bravo, event supprimée"}); 
    }); 
    
});

app.use(myRouter);   
app.listen(process.env.PORT || port, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port); 
});