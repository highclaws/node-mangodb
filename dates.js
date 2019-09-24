var MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://esgi-admin:esgi@cluster0-onexg.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.connect(err => {

    var dbo = client.db("test");
    dbo.createCollection("dates", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        client.close();
    });

    var query = { _id: "10059244" };
    const collection = client.db("sample_airbnb").collection("listingsAndReviews").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        client.close();
    });
    // perform actions on the collection object
});

