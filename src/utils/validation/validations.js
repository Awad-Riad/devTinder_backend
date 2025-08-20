const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if(!firstName || !lastName){
    throw new Error("Name is not valid")

  }
};
