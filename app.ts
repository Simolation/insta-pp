require("dotenv").config();

import express from "express";
const app = express();
const server = require("http").createServer(app);
import request from "request";
import CryptoJS from "crypto-js";

// load instagram stuff
import { IgApiClient, IgExactUserNotFoundError } from "instagram-private-api";
const ig = new IgApiClient();

// Serve static pages
app.use(express.static(__dirname + "/public"));

// Generate a new bucket and open the page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// load instagram user data
app.get("/api/profile/:id", async function (req, res) {
  try {
    const userID = await ig.user.getIdByUsername(req.params.id);

    const info = await ig.user.info(userID);

    const images = {
      normal: `/api/image?id=${encodeURIComponent(
        encrypt(info.profile_pic_url)
      )}`,
      hd: `/api/image?id=${encodeURIComponent(
        encrypt(info.hd_profile_pic_url_info.url)
      )}`,
    };

    const result = {
      userid: info.pk,
      username: info.username,
      full_name: info.full_name,
      bio: info.biography,
      external_url: info.external_url,
      private: info.is_private,
      verified: info.is_verified,
      business: info.is_business,
      profile_pictures: images,
      statistics: {
        media: info.media_count,
        follower: info.follower_count,
        following: info.following_count,
      },
    };

    res.json({ status: "success", data: result });
  } catch (err) {
    // if user not found return 404
    if (err instanceof IgExactUserNotFoundError) {
      res.status(404).json({ status: "not_found" });
    } else {
      // else return server error
      res.status(500).json({ status: "error", trace: err });
    }
  }
});

// proxy the instagram image to pass CORS
app.get("/api/image", async function (req, res) {
  // get the encrypted image id
  const id = req.query.id;

  if (id) {
    try {
      // decrypt original url
      const url = decrypt(id as string);

      // proxy image request
      request.get(url).pipe(res);
    } catch (err) {
      res.status(400).json({ status: "error", trace: err });
    }
  } else {
    res.status(400).json({ status: "error" });
  }
});

// set up instagram session
ig.state.generateDevice(process.env.IG_USERNAME);
(async () => {
  await ig.simulate.preLoginFlow();
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  process.nextTick(async () => await ig.simulate.postLoginFlow());

  // Start the server on the given port
  server.listen(process.env.PORT || 8080);
  console.log("Insta API ready!");
})();

// Encrypt with AES to prevent misuse as proxy server
function encrypt(input: string): string {
  const utf8 = CryptoJS.enc.Utf8.parse(input);
  return CryptoJS.AES.encrypt(utf8, process.env.KEY).toString();
}

// Decrypt with AES
function decrypt(encrypted: string): string {
  const decryptedBytes = CryptoJS.AES.decrypt(encrypted, process.env.KEY);
  return decryptedBytes.toString(CryptoJS.enc.Utf8);
}
