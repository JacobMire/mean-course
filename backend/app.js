const bodyParser = require('body-parser');
const express =  require('express');
const Post = require('./models/post')
const mongoose = require('mongoose')

const app = express();

mongoose.connect("mongodb+srv://jacobmire:bd4AyOXyj7PnfkQ7@cluster0.tba7pit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
 .then(() => {
    console.log("connected to db")
 })
 .catch(() =>{
    console.log("connection failed")
 });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader(
        'Access-Control-Allow-Headers',
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
});

app.post("/api/posts", (req, res, next)=> {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'post sent yup',
            postId: createdPost._id
        });
    });
});

app.put('/api/posts/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        console.log(result);
        res.status(200).json({message: "update successful"});
    });
})


app.get('/api/posts/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post);
        }
        else{
            res.status(404).json({message: "post not found"});
        }
    })
})


app.get('/api/posts', (req, res, next)=> {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    if(pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
    }
    postQuery
      .then(documents =>{
        res.status(200).json({
            message: 'got the posts', 
            posts: documents
        });
    });
});

app.delete("/api/posts/:id", (req, res, next)=> {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: "deleted in appjs"});

    });
});



module.exports = app;