export const mynyumbaApiDocumentation = (req, res) => {
    const jsonData = {
      "Welcome to MyNyumbaAPI": "200 status",
      "/api/users": "Get all the users",
      "/api/listing/": "Add listing",
      "/api/auth/login": "Login",
      "/api/auth/register": "Register",
    };
    const jsonString = JSON.stringify(jsonData);
    res.write(jsonString);
    res.end();
  };
  