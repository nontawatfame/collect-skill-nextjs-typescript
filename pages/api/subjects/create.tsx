// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosResponse } from 'axios'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'POST') {
        const result = await axios.post(`${process.env.URL_API}/subject/create`, {name: req.body.name})
            .then((reso: AxiosResponse<any, any>) => reso)
            .catch((reso: AxiosResponse<any, any>) => reso)
        if (result.status == 201) {
            res.status(201).json(result.data)
            return false
        }

        res.status(200).json(result)
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }

}
