// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const axios = require("axios");

exports.handler = async (event) => {
  if (event.queryStringParameters) {
    const queryParams = event.queryStringParameters;
    const verify_token = process.env.VERIFY_TOKEN;
    
    let mode = queryParams["hub.mode"];
    let token = queryParams["hub.verify_token"];
    let challenge = queryParams["hub.challenge"];
    
    if (mode && token) {
      if (mode ==="subscribe" && token === verify_token) {
        console.log("WEBHOOK_VERIFIED");
        return {
          statusCode: 200,
          body: challenge,
        };
      } else {
        return {
          statusCode: 403,
        };
      }
    }
  } else {
    const token = process.env.WHATSAPP_TOKEN;
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
        let from = body.entry[0].changes[0].value.messages[0].from;
        let msg_body = body.entry[0].changes[0].value.messages[0].text.body;
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
