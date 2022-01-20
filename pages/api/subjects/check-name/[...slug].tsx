// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosResponse } from 'axios'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'GET') {
        console.log("req.query")
        console.log(req.query)
        const result = await axios.get(`${process.env.URL_API}/subject/check-subject-name/${req.query.slug[0]}/${req.query.slug[1]}`)
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