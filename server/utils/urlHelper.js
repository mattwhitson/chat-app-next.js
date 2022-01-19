const axios = require("axios");
const cheerio = require("cheerio");

const isURL = (str) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};

const getMetaTags = async (message) => {
  if (isURL(message)) {
    try {
      const response = await axios.get(message);

      const $ = cheerio.load(response.data);

      const title = $("meta[property='og:title']").attr("content");
      const image = $("meta[property='og:image']").attr("content");
      const description = $("meta[property='og:description']").attr("content");

      return {
        message,
        title,
        image,
        description,
      };
    } catch (err) {
      console.log("something went wrong...");
      return null;
    }
  } else {
    return null;
  }
};

module.exports = {
  getMetaTags,
};
