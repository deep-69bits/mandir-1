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
    const { row, column } = req.query;
    let fieldKey;
    let newRow = parseInt(row) - 1;
    const spreadsheetLink = "https://abp-metaverse-bucket.s3.amazonaws.com/content.json";

    if (column == 0) {
      fieldKey = "type";
    } else if (column == 1) {
      fieldKey = "link";
    } else if (column == 2) {
      fieldKey = "comment";
    }

    await axios
      .get(spreadsheetLink)
      .then((response) => {
        const data = JSON.parse(JSON.stringify(response.data));
        // res.send(newRow);
        res.send(data[newRow][fieldKey]);
        //   const data = response.data.split("\n").map((item, index) => {
        //     if (index == row) {
        //       return item.split(",")[column];
        //     }
        //   });
        //   const filtered = data.filter((datum) => datum && datum.length > 0);
        //   res.status(200).send(filtered[0]);
      })
      .catch((error) => {
        res.status(500).json({ error: "An error occurred while fetching the spreadsheet data." });
      });
  }
  handler(req, res);
};
