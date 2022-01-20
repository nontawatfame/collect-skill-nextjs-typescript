import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosResponse } from 'axios'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'GET') {
        let page: any = req.query.slug[0]
        let size: any = req.query.slug[1]
        let startDate: any = req.query.slug[2]
        let endDate: any = req.query.slug[3]
        const result = await axios.get(`${process.env.URL_API}/log-time/get-log-times/${page}/${size}/${startDate}/${endDate}`)
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
