var MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://esgi-admin:esgi@cluster0-onexg.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
try {

    client.connect(err => {
        // async
        (async()=> {

            var dbo = client.db("test");

            dbo.createCollection("dates", function(err, res) {
                if (err) throw err;
                console.log("Collection created!");
                client.close();
            });


            dbo.collection("dates").insertOne({ date: (new Date()).toString() }, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                client.close();
            });


            dbo.collection("dates").find({}).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                client.close();
            });

        })()

    });

} catch (err) {
    console.log(err.stack);
}
