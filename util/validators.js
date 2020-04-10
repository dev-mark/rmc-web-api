isEmpty = (string) => {
  if (string.trim() === "") {
    return true;
  } else {
    return false;
  }
};

isEmailValid = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true;
  } else {
    return false;
  }
};

exports.validateDetails = (data) => {
  const { name, email, message } = data;
  let errors = {};

  if (isEmpty(name)) {
    errors.name = "Name must not be empty.";
  }

  if (isEmpty(email)) {
    errors.email = "Email must not be empty.";
  } else if (!isEmailValid(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (isEmpty(message)) {
    errors.message = "Message must not be empty.";
  }

  return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

// module.exports = {
//   isEmpty,
// };
