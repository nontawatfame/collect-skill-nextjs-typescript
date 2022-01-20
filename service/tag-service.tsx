import axios, { AxiosResponse } from "axios"

export async function create(tagName: string, subjectId: number) {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/tag/create`, {name: tagName, subject_id: subjectId})
        .then((res: AxiosResponse<any, any>) => res)
        .catch((res: AxiosResponse<any, any>) => res)
    return res
}

export async function subjectId(subjectId: number) {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/tag/subject-id/${subjectId}`)
        .then((res: AxiosResponse<any, any>) => res)
        .catch((res: AxiosResponse<any, any>) => res)
    return res
}

export async function checkTagName(tagName: string, idSubject: number, tagId: number) {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/tag/check-name/${tagName}/${idSubject}/${tagId}`)
        .then((res: AxiosResponse<any, any>) => res)
        .catch((res: AxiosResponse<any, any>) => res)
    return res
}
