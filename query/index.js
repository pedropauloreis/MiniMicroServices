const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json()); //CORRIGINDO ERRO 'bodyParser' is deprecated.ts(6385)
app.use(cors());

const posts = {};

//EXEMPLO:
// posts === {
//     'das564da':{
//         id: 'das564da',
//         title: 'post title',
//         comments: [
//             {id: 'a31fdas5', content: 'post comment'}
//         ]
//     }
// }

const handleEvent = (type,data) => {
    if (type==='PostCreated'){
        const {id,title} = data;
        posts[id] = {id,title,comments: []};
    }

    if (type==='CommentCreated'){
        const {id,content,postId,status} = data;
        const post = posts[postId];
        post.comments.push({id, content,status});
    }

    if (type==='CommentUpdated'){
        const {id,content,postId,status} = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {return comment.id === id;});
        comment.status = status;
        comment.content = content;
    }
};

app.post('/events', (req,res) => {
    console.log('Received Event', req.body.type);

    const {type, data} = req.body;
    
    handleEvent(type, data);

    res.send({});

})

app.get('/posts', (req,res) => {
    res.send(posts);    
})

app.listen(4002, async () => {
    console.log('v-k8s-3');
    console.log('Listening on 4002');

    try {
        const res = await axios.get('http://event-bus-srv:4005/events');

        for(let event of res.data){
            console.log('Processing event:',event.type);
            handleEvent(event.type,event.data);
        }
    }
    catch(error){
        console.log(error.message);
    }

})