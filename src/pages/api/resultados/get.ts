import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getFromS3 } from "./list";
import { saveToS3 } from "./save";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = "https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil";
    const { data } = await axios.get(url);

    // SALVA COMO FALLBACK
    await saveToS3(data);

    return res.status(200).json({
      source: "api_oficial",
      data,
    });
  } catch (error) {
    console.log("⚠ Falha na API da Caixa, lendo do S3...");
    const fallback = await getFromS3();

    if (!fallback) {
      return res.status(500).json({
        error: "Nenhum resultado encontrado (API falhou e fallback vazio).",
      });
    }

    return res.status(200).json({
      source: "fallback_s3",
      data: fallback,
    });
  }
}
