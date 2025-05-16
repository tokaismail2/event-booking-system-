const checkMail = async (email) => {
  
      // Regular expression to validate email format
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

      if (regex.test(email)) {
          return 'DELIVERABLE'; // Email has a valid format
      } else {
          return 'UNDELIVERABLE'; // Email format is invalid
      }
  
};

module.exports =  checkMail ;