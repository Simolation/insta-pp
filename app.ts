require('dotenv').config()

const express = require("express");
const app = express();
const server = require("http").createServer(app);

// load instagram stuff
import { IgApiClient } from 'instagram-private-api';
const ig = new IgApiClient();

// Serve static pages
app.use(express.static(__dirname + "/public"));

// Generate a new bucket and open the page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// load instagram data
// load instagram user data
app.get("/insta/:id", async function(req, res) {
  try {
    const userID = await ig.user.getIdByUsername(req.params.id);

    const info = await ig.user.info(userID);

    const result = {
      userid: info.pk,
      username: info.username,
      full_name: info.full_name,
      bio: info.biography,
      external_url: info.external_url,
      private: info.is_private,
      verified: info.is_verified,
      business: info.is_business,
      profile_pictures: {
        normal: info.profile_pic_url,
        hd: info.hd_profile_pic_url_info.url
      },
      statistics: {
        media: info.media_count,
        follower: info.follower_count,
        following: info.following_count
      }
    }

    res.json({status: 'success', data: result})
    
  } catch (err) {
    res.status(404).json({status: 'error', trace: err })
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
  console.log('Insta API ready!')
})();
