
//MQTT Broker definitions
const mqtt    = require('mqtt');
//const broker = 'mqtt://automaatio:Z0od2PZF65jbtcXu@automaatio.cloud.shiftr.io';
const broker = 'mqtt://test.mosquitto.org';
const user = '';
const pw = ''; 

//Connect to broker
mq = mqtt.connect(broker, {
  'username': user,
  'password': pw
});

//subscribe the topic
mq.subscribe('automaatio1/#');

//dotify about successful connection
mq.on('connect', function(){
    console.log('Connected.....');
});

//API for MongoDB Atlas
const { MongoClient, ServerApiVersion } = require('mongodb');

// Replace the URI-string below by your own URI (get that from Mongo DB Atlas 
// Connect > driver > NodeJs (v. 6.7), don't forget to add your own username & password to the string
const uri = "mongodb+srv://aki:Salasana@cluster0.79l3dlw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//data object for MQTT message
var obj;

//wait for data from MQTT broker and insert it to MongoDB
mq.on('message', function(topic, message) {
	//console.log(message.toString('utf8'));
	obj = JSON.parse(message);
  
	//DB and collection names are obtained from the message
	var dbname = obj.db_name;
	var collection = obj.coll_name;

	//timestamp is added
	obj.DateTime = timeConverter(Date.now());
  
	console.log(obj);
 
	//Definition of database & collection and and object for data retrieval/storage
	const myDB = client.db(dbname);
	const myColl = myDB.collection(collection);
  
	//insertion of ¨message to MongoDB
	myColl.insertOne(obj);
		
	console.log(
	`An entry was inserted successfully`,
	);
});



