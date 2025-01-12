const express = require("express");

const Post = require('../models/post')
const router = express.Router();

router.post("", (req, res, next)=> {
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

router.put(':id', (req, res, next) => {
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


router.get(':id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post);
        }
        else{
            res.status(404).json({message: "post not found"});
        }
    })
})


router.get('', (req, res, next)=> {
    const pageSize = +req.query.pagesize;
    const currentPage = req.query.page;
    const postQuery = Post.find();
    let fetchedPosts
    if(pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
    }
    postQuery
      .then(documents =>{
        fetchedPosts = documents;
        return Post.count(); 
    })
    .then(count => {
        res.status(200).json({
            message: 'got the posts', 
            posts: fetchedPosts,
            maxPosts: count
        });
    })
});

router.delete(":id", (req, res, next)=> {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: "deleted in routerjs"});

    });
});

module.exports = router;