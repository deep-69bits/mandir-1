import Cors from "nextjs-cors";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  await Cors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  async function handler(req, res) {
    const { option } = req.query;
    console.log(option);
    if (option == 1) {
    } else if (option == 2) {
    } else if (option == 3) {
    } else if (option == 4) {
    }
    res.send(data[newRow][fieldKey]);
  }
  handler(req, res);
};
