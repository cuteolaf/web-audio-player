import nextConnect from "next-connect";
import multer from "multer";
import { supabase } from "../../lib/supabaseClient";
import { AUDIOS_TABLE } from "../../lib/consts";

let filename = Date.now() + ".mp3";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
      cb(null, filename);
    },
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post((req, res) => {
  const { title } = req.body;
  const { error } = supabase.from(AUDIOS_TABLE).insert([
    {
      title,
      filename,
    },
  ]);
  if (error) res.status(500).json({ error });
  else res.status(200).json({ data: "success" });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
