//GET A USER

// this a request to get a particular user
router.get("/", async (req, res) => {
  const userId = req.query.userId; //this means that you search with queries like localhost:8800/user/userId="32bjb1j2334hivbi414uy111414"
  const username = req.query.username; //this means that you search with queries like localhost:8800/user/username="canon"
  // when a get request is made on on the route(/:id) to get a particular user try finding a user by id(req.params.id), if successfull return the status code 200 and and return a user json otherwise return the error code
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });

    //this expression makes it possible to return other user details(...other [spread operator]) and leave out the password and updatedAt
    const { password, updatedAt, ...other } = user._doc;

    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});
