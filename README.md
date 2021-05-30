# Instagram Profile Picture

Get an Instagram profile picture in full size. This project is live at [insta.simons.world](https://insta.simons.world/)

## How to install

To run this project you need Node.js, Yarn (npm would also work) and TypeScript.

1. First clone or download this repository to your computer.
2. Open a terminal window in the folder and run `yarn` to load all necessary dependencies. (If you use npm, you can run `npm install`)
3. Then prepare your Instagram credentials (email and password). However, it is quite common for Instagram to block your account if they think it is a bot (which is true ^^), so I would advise you not to use your personal account.  
   If this happens anyway, you can manually unlock your account by logging into the regular app on your cell phone and then follow the instructions.
4. Create a new `.env` file in the project folder and add your Instagram credentials and an AES key as follows:

```
IG_USERNAME=YourEmail
IG_PASSWORD=YourPassword
KEY=EncryptionKey
```

5. To run this app in "production" I am using [pm2](https://pm2.keymetrics.io/) and can be started with `yarn start` where it will be available under port 3002. The URL would then be http://localhost:3002/.  
   To just run it locally on your computer you can use ts-node to execute this TypeScript application. Just run `ts-node app.ts`. The server will start on port 8080 and thus will be available at http://localhost:8080/.
