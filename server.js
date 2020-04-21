// const express = require('express');
// const path = require('path');

// const app = express();

// // Serve only the static files form the dist directory
// app.use(express.static(path.join(__dirname, 'dist/farmers')));

// app.get('/*', function(req,res) {
//     res.sendFile(path.join(__dirname,'dist/farmers/index.html'));
// });

// // Start the app by listening on the default Heroku port
// app.listen(process.env.PORT || 8080);


// const express = require('express');
// const app = express();
// const path = require('path');
// const port = process.env.PORT || 8000;
// const server = require('http').Server(app);
// // app.use(express.static(path.join(__dirname, 'dist/farmers')));
// app.use(express.static(path.join(__dirname, 'dist/farmers')));


// server.listen(port, function() {
//     console.log("App running on port " + port);
// })

// // PathLocationStrategy

// app.get('', function(req, res) {
//     res.sendFile(path.join(__dirname, 'src', 'index.html'));
// });

// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname, 'src', 'index.html'));
// });



const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname+'/dist'));

app.listen(process.env.PORT||8080);


//Path Location Strategy
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname+'/dist/index.html'));
  });

console.log('Console Listening');
