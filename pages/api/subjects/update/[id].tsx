// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosResponse } from 'axios'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'PUT') {
        const result = await axios.put(`${process.env.URL_API}/subject/update/${req.query.id}`, { name: req.body.name })
            .then((reso: AxiosResponse<any, any>) => reso)
            .catch((reso: AxiosResponse<any, any>) => reso)
        if (result.status == 200) {
            res.status(200).json(result.data)
            return false
        }
        res.status(200).json(result)
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }

}
