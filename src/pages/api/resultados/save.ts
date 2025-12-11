import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function saveToS3(data: any) {
  try {
    await s3
      .putObject({
        Bucket: process.env.AWS_BUCKET!,
        Key: "resultados.json",
        Body: JSON.stringify(data),
        ContentType: "application/json",
      })
      .promise();

    console.log("✔ Salvou fallback no S3");
  } catch (err) {
    console.error("❌ Erro ao salvar S3", err);
  }
}
