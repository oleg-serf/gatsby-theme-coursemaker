const axios = require("axios");
const FormData = require("form-data");

module.exports = {
  // Authenticate with coursemaker cms
  // TODO: extract out into plugin
  getAuthToken: async () => {
    if (process.env.AUTH_HEADER) return process.env.AUTH_HEADER;
    if (process.env.AUTH_TOKEN) return `Bearer ${process.env.AUTH_TOKEN}`;

    // Otherwise login
    let data = new FormData();
    data.append("username", process.env.GATSBY_TEST_STRAPI_USER);
    data.append("password", process.env.GATSBY_TEST_STRAPI_PASSWORD);
    data.append("grant_type", "password");

    return await axios({
      method: "post",
      url: `${process.env.GATSBY_API_BASE_URI}/api/v1/login/access-token`,
      headers: data.getHeaders(),
      data: data,
    }).then(
      (response) => `Bearer ${response.data.access_token}`,
      (error) => {
        console.log(error);
        throw error;
      }
    );
  },
};
