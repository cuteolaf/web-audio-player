import nextConnect from "next-connect";
import multer from "multer";
import { supabase } from "../../lib/supabaseClient";
import { AUDIOS_BUCKET, AUDIOS_TABLE } from "../../lib/consts";

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
const upload = multer({});
apiRoute.use(upload.single("file"));

apiRoute.post(async (req, res) => {
  const { title } = req.body;
  const storage = supabase.storage.from(AUDIOS_BUCKET);
  const filename = Date.now() + ".mp3";
  const { error } = await storage.upload(filename, req.file.buffer, {
    contentType: "audio/mpeg",
  });

  if (error) {
    console.log("error:", error);
    res.status(500).json(error);
    return;
  }

  const { publicURL } = storage.getPublicUrl(filename);

  const { error: dbError } = await supabase.from(AUDIOS_TABLE).insert([
    {
      title,
      filename: publicURL,
    },
  ]);

  if (dbError) {
    console.log(dbError);
    res.status(500).json(dbError);
    return;
  }
  res.status(200).json({ result: "success" });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
