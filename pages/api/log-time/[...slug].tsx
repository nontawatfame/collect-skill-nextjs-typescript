import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'GET') {
        const result = await axios.get(`${process.env.URL_API}/log-time/get-log-times/${req.query.slug[0]}/${req.query.slug[1]}`)
        const data = await result.data
        res.status(200).json(data)
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }

}