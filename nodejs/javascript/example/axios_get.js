import axios from "axios";
import Config from "../config.js";

const api = Config.meetu_api_address + Config.meetu_api_activity_get_recoms;

axios
  .get(api, {
    headers: {
      token: Config.meetu_api_token,
    },
    params: {
      page: 1,
      pageSize: 10,
    },
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
