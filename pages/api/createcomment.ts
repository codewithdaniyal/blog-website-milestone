// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@sanity/client';

const client = createClient({
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', // Fixed '=' to ':'
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 's5wlo7s0', // Fixed '=' to ':'
  useCdn: true, // Fixed '=' to ':'
  token: process.env.SANITY_API_TOKEN, // Corrected syntax for `token`
});

type Data = {
  name: string;
};

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, email, comment } = JSON.parse(req.body); // Parse request body correctly

  try {
    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment,
    });
  }
    catch (err) {
    return res.status(500).json({ message: `Couldn't submit comment`, err });
  }
  console.log("comment submitted")
  return res.status(200).json({ message: 'Comment Submitted!' });
}
