// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const axios = require("axios");

exports.handler = async (event) => {
  if (event.queryStringParameters) {
    const queryParams = event.queryStringParameters;
    const verify_token = "QUINN";

    // Parse params from the webhook verification request
    let mode = queryParams["hub.mode"];
    let token = queryParams["hub.verify_token"];
    let challenge = queryParams["hub.challenge"];

    // Check if a token and mode were sent
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode ==="subscribe" && token === verify_token) {
        console.log("WEBHOOK_VERIFIED");
        return {
          statusCode: 200,
          body: challenge,
        };
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        return {
          statusCode: 403,
        };
      }
    }
  } else {
    const token = "EAAFpnO7WYJUBOz5aPMHDha32pXwZAcZB3RXeaAB6v2dc8wkSlHwZAKfRScARw2AGb7rCGWwgXEIQZBLRAurgTDcLRKFCRjEfPnHYzyKpUbYhgtuhllizeoYcJ0JEW4H6ZBfue37HypkZA38GF9EZATrs8MYBbjhITx2fZCfpn1p6gXzNaeAHcBnl785PApjTl5mh5fv4ufsbSxZCdQ8WXjv8ZD";
    const body = JSON.parse(event.body);
    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        let phone_number_id =
          body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        let msg_body = body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
        const tanslate = msg_body;
        await axios({
          method: "POST",
          url:
            "https://graph.facebook.com/v18.0/" +
            phone_number_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: { body: tanslate },
          },
          headers: { "Content-Type": "application/json" },
        });
        return {
          statusCode: 200,
        };
      }
    }
  }
};