// pages/api/departamentos.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), '/departamentos.json');
  const data = fs.readFileSync(filePath, 'utf8');
  const departamentosData = JSON.parse(data);
  res.status(200).json(departamentosData);
}
