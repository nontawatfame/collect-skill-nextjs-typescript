

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { LogTime } from '../../../components/model/logTime'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {

     console.log(req.body)
    if (req.method === 'POST') {
        const result = await axios.post(`${process.env.URL_API}/log-time/create`, req.body)
        const data = await result.data
        res.status(200).json(data)
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }

}
