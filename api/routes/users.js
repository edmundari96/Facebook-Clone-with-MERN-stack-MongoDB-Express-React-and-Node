// this is requiring the auth.js in thesame folder as users.js cos its used to authenticate the user
const { route } = require("./auth");

// express router is a method of expressjs used for http request and response betewwen pages and server
const router = require("express").Router();

//this requires the User.js where the shape.schema of the user is defined
const User = require("../models/User");

//this dependency is used to encrypt passwords
const bcrypt = require("bcrypt");

//UPDATE USER
// this is a put request which updates a user whose id is specifies as a parameter in the url
router.put("/:id", async (req, res) => {
    //if the id of the guy requesting update is not strictly equal to the one in the url parameters or if the guy requesting the update is an admin then do the following
   if(req.body.userId === req.params.id || req.body.isAdmin){
      // if there is a password then do the following below
      if(req.body.password){
          // if there is a password then try and encrypt the password and put it back into req.body.password
          try{
               const salt = await bcrypt.genSalt(10);
               req.body.password = await bcrypt.hash(req.body.password, salt)
           }catch(err){
               return res.status(500).json(err);
           }
       }
       // if the the above conditions is satisfied try the commands below which is to find the user by the id and update it
       try{
           const user = await User.findByIdAndUpdate(req.params.id, {
               $set: req.body,
           });
           // if the user is successfully updated then return a status code of 200(meaning that everything os ok) and also return a json text "account has been updated successfully"
           res.status(200).json("Account has been updated");
       }catch(err){
           res.status(500).json("error could not update this user");
       }

   }else{
     //if the id of the guy requesting update is not equal to the one in the url parameters and the guy requesting the update is not an admin then return the status code and the json response below
     return res.status(403).json("you can update only your account");
   }
});

//DELETE USER

// this is a delete request which deletes a user whose id is specifies as a parameter in the url
router.delete("/:id", async (req, res) => {
    //if the id of the guy requesting delete is not strictly equal to the one in the url parameters or if the guy requesting to delete is an admin then do the following
   if(req.body.userId === req.params.id || req.body.isAdmin){
      
       // if the the above conditions is satisfied try the commands below which is to find the user by the id and delete it
       try{
           const user = await User.findByIdAndDelete(req.params.id);
           // if the user is successfully deleted then return a status code of 200(meaning that everything os ok) and also return a json text "account has been deleted successfully"
           res.status(200).json("Account has been deleted successfully");
       }catch(err){
           res.status(500).json("deleting of this user failed");
       }

   }else{
     //if the id of the guy requesting delete is not equal to the one in the url parameters and the guy requesting the delete is not an admin then return the status code and the json response below
     return res.status(403).json("you can delete only your account");
   }
});

//GET A USER

// this a request to get a particular user 
router.get("/", async (req, res) => {
        const userId = req.query.userId;
        const username = req.query.username;
    // when a get request is made on on the route(/:id) to get a particular user try finding a user by id(req.params.id), if successfull return the status code 200 and and return a user json otherwise return the error code
    try{
        // const user = await User.findById(req.params.id);
                const user = userId
                  ? await User.findById(userId)
                  : await User.findOne({ username: username });

        //this expression makes it possible to return other user details(...other [spread operator]) and leave out the password and updatedAt
        const {password, updatedAt, ...other} = user._doc;

        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err);
    }
})

// router.get("/", async (req, res) => {
//     const userId = req.query.userId;
//     const username = req.query.username;
//     try {
//         const user = userId ? await User.findById(userId) : await User.findOne({username:username});
//         const {password, updatedAt, ...other}  =  user._doc;
//         // res.status(200).json(other);
//         res.json(username)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// })

//FOLLOW A USER

router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            // this is the guy you want to follow
            const user = await User.findById(req.params.id);
            
            // this is the guy that is doing the following
            const currentUser = await User.findById(req.body.userId);

            // if the array in the database containing all friend contains this guy (req.body.userId) then ....below
            if(!user.followers.includes(req.body.userId)){
                
            // push into the (followers) array of this guy my id showing that am one of its followers    
            await user.updateOne({ $push: { followers: req.body.userId } });

            //push his id into my own (followins) array showing that am following this guy   
            await currentUser.updateOne({ $push: {   followings: req.params.id } });

            res.status(200).json("user has been followed");
            
            }else{
                res.status(403).json("you already follow the user");
            }

        }catch(err){
            res.status(500).json('they cant be friends');
        }

    }else{
        res.status(403).json("you can not follow yourself");
    }
} )

//UNFOLLOW A USER

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      // this is the guy you want to unfollow
      const user = await User.findById(req.params.id);

      // this is the guy that is doing the unfollowing
      const currentUser = await User.findById(req.body.userId);

      // if the array in the database containing all followers contains this guy (req.body.userId) then ....below
      if (user.followers.includes(req.body.userId)) {
        // pull out my id from this guys follwers array showing that am no longer one of its followers
        await user.updateOne({ $pull: { followers: req.body.userId } });

        //pull out his id out of my own (followings) array which means i no longer follow this guy
        await currentUser.updateOne({ $pull: { followings: req.params.id } });

        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you already unfollowed this user");
      }
    } catch (err) {
      res.status(500).json("they cant be friends");
    }
  } else {
    res.status(403).json("you can not unfollow yourself");
  }
});


module.exports = router;