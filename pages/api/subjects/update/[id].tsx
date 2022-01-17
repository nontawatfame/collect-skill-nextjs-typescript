// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    console.log(req.query)
    if (req.method === 'PUT') {
        const result = await axios.put(`${process.env.URL_API}/subject/update/${req.query.id}`, {name: req.body.name})
        const data = await result.data
        res.status(200).json(data)
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }

}
