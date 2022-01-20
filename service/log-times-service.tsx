import axios, { AxiosResponse } from "axios"
import { LogTime } from "../components/model/logTime"

export async function logTimesCreate(logtime: LogTime) {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/log-time/create`, logtime)
        .then((res: AxiosResponse<any, any>) => res)
        .catch((res: AxiosResponse<any, any>) => res)
    return res
}

export async function getLogTimes(page: number, size: number, startDate: string, endDate: string) {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/log-time/${page}/${size}/${startDate}/${endDate}`)
        .then((res: AxiosResponse<any, any>) => res)
        .catch((res: AxiosResponse<any, any>) => res)
    return res
}