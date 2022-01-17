// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    console.log(req.query)
    console.log("id")
    if (req.method === 'GET') {
        const result = await axios.get(`${process.env.URL_API}/subject/get-subjects/${req.query.id}`)
        const data = await result.data
        res.status(200).json(data)
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }

}
