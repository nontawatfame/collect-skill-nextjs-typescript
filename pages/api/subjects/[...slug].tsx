// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosResponse } from 'axios'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    console.log(req.query)
    console.log("idee")
    if (req.method === 'GET') {
        const result = await axios.get(`${process.env.URL_API}/subject/get-subjects/${req.query.slug[0]}/${req.query.slug[1]}`)
            .then((reso: AxiosResponse<any, any>) => reso)
            .catch((reso: AxiosResponse<any, any>) => reso)
        if (result.status == 200) {
            res.status(200).json(result.data)
            return false
        }
        res.status(200).json(res)
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }

}
