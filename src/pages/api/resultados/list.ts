import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function getFromS3() {
  try {
    const file = await s3
      .getObject({
        Bucket: process.env.AWS_BUCKET!,
        Key: "resultados.json",
      })
      .promise();

    return JSON.parse(file.Body!.toString("utf-8"));
  } catch (err) {
    console.error("Erro lendo S3:", err);
    return null;
  }
}
