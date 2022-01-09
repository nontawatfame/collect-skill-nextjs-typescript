import axios from "axios"

export async function getApiSubjects(pages: number, size: number) {
    const res = await axios(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/subjects/${pages}/${size}`)
    const data = await res.data
    return data
}

