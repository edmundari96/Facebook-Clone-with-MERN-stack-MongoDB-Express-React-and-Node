// this is requiring the router method inbuilt in the express
const router = require("express").Router();

//this requires the Post.js where the shape.schema of the post is defined
const Post = require("../models/Post");

//this requires the User.js where the shape.schema of the user is defined
const User = require("../models/User");

//CREATE A POST
router.post("/", async (req, res) => {
    // here a new instantiation of the Post model with the request body passed as the argument......its then stored in the variable newPost
    const newPost = new Post(req.body);
    try{
        // this is saving the post in the database
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).send('failed to post to the database');
    }
})

//UPDATE A POST
// for an update operation an id is always used that why the id is passed ("/:id")
router.put("/:id", async (req, res) => {
    
    //for you to update something you must find it// that why i am searching for the Post you are requesting to update by its id (req.params.id)
    const post = await Post.findById(req.params.id);

    try{ 

        // for you to confirm if the guy requesting to make an update to a post is the guy that made the post initialy you compare the userId of the post and the userid of the the guy make the request..........if they are equal then.......below
       if(post.userId === req.body.userId){ 
         
        // update the post body
         await post.updateOne({ $set: req.body });
         res.status(200).json("post has been updated");

       }else{
           // if not, return an error status code and an error message
        res.status(403).json("you can only update your post");
       }
    }catch(err){
        res.status(500).json("failed to update");
    }

});
//DELETE A POST

// for an delete operation an id is always needed that why the id is passed ("/:id")
router.delete("/:id", async (req, res) => {
    
    //for you to delete something you must find it// that why i am searching for the Post you are requesting to delete by its id (req.params.id)
    const post = await Post.findById(req.params.id);

    try{ 

        // for you to confirm if the guy requesting to make a delete to a post is the guy that made the post initialy you compare the userId of the post and the userid of the the guy make the delete request..........if they are equal then.......below
       if(post.userId === req.body.userId){ 
         
        // delete the post body
         await post.deleteOne();
         res.status(200).json("post has been deleted");

       }else{
           // if not, return an error status code and an error message
        res.status(403).json("you can only delete your post");
       }
    }catch(err){
        res.status(500).json("failed to delete");
    }

});
//LIKE OR DISLIKE    A POST

router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne( { $push: { likes: req.body.userId} });
            res.status(200).json("the post has been liked");
        }else{
            await post.updateOne({$pull: { likes: req.body.userId }});
            res.status(200).json("the post has been disliked");
        }
    }catch(err){
        res.status(500).json('something went wrong');
    }
})
//GET A POST

router.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post); 
    }catch(err){
        res.status(500).json("could not find this post");
    }
})
//GET TIMELINE POST
// this is a request to find all the post on this particular users id(timeline)
router.get("/timeline/:userId", async (req, res) => {
  try {
    //this is to get the id of the user that wants to get all the post on their timline
    const currentUser = await User.findById(req.params.userId);

    //this is to get all the post that is made by this current user
    const userPosts = await Post.find({ userId: currentUser._id });

    // this is to get all the post of all friends of the current user (thats all the post that is made by all the guys in the followings)
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
    // res.json(friendPosts);
  } catch (error) {
    res.status(500).json("no timeline found");
  }
});



//GET USERS ALL POSTS
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({username:req.params.username});
    const posts = await Post.find({userId:user._id})
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json("no timeline found");
  }
});




module.exports = router;
