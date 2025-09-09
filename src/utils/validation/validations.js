const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  }
};

const validateEditprofileData = (req) => {
  const allowedEditFields = [
    "emailId",
    "password",
    "age",
    "gender",
    "photoUrl",
    "about",
    "firstName",
    "lastName",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};
module.exports = { validateSignUpData,validateEditprofileData };
