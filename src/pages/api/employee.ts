// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) { 
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const prisma = new PrismaClient();

  const { id, name, date, email, age, workRegime } = req.body;

  try {
    const employee = await prisma.employee.create({
      data: {
        ID: id,
        name,
        registeredOn: date,
        email,
        workRegime,
        age,
      },
    });

    res.status(200).json({ employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }

}
