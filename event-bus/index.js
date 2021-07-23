const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json()); //CORRIGINDO ERRO 'bodyParser' is deprecated.ts(6385)

const events = [];

app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);
    const event = req.body;

    events.push(event);

    axios.post('http://posts-clusterip-srv:4000/events',event).catch((err) => {
        console.log(err.message);
      });
    axios.post('http://comments-clusterip-srv:4001/events',event).catch((err) => {
        console.log(err.message);
      });
    axios.post('http://query-clusterip-srv:4002/events',event).catch((err) => {
        console.log(err.message);
      });
    axios.post('http://moderation-clusterip-srv:4003/events',event).catch((err) => {
        console.log(err.message);
      });

    res.send({status: 'OK'});
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('v-k8s-3');
    console.log('Listening on 4005');
});