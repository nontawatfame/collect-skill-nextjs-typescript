import axios from "axios"
import { LogTime } from "../components/model/logTime"

export async function logTimesCreate(logtime: LogTime) {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/log-time/create`, logtime)
    const data = await res.data
    return data
}