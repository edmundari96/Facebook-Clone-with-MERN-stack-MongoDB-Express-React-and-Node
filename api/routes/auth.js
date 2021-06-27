// this is requiring the router method inbuilt in the express
const router = require("express").Router();

// this is requiring the database model for posting users// the schema of the user form submited to the database
const User = require("../models/User");

//this dependency is used to encrypt passwords
const bcrypt = require("bcrypt");


////////////////////////REGISTER///////////////////////////////////////

// this route is for users registration
router.post("/register", async (req, res) => {
  try{
    //generate encrypted password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
 
       // create new password
      const newUser = new User({
        profilePicture:req.body.profilePicture,
        coverPicture:req.body.coverPicture,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        desc:req.body.desc,
        city:req.body.city,
        from:req.body.from,
        relationship:req.body.relationship
      });

      // save user and return response
    const user = await newUser.save();
    res.status(200).json(user);
  }catch(err){
        res.status(500).json(err);
  }
  // await user.save();
  // res.send('ok');
  // res.send('this is the auth page');
});

///////////////////////////////LOGIN///////////////////////////////////////
router.post("/login", async (req, res) => {

  try{
    const user = await User.findOne({email: req.body.email});
    !user && res.status(404).json("user not found"); 

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    res.status(200).json(user);

  }catch(err){
    res.status(500).json("no user found")
  }

})

module.exports = router;
