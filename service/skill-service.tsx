import axios, { AxiosResponse } from "axios"

export async function getApiSubjects(pages: number, size: number) {
    const res = await axios(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/subjects/${pages}/${size}`)
        .then((res: AxiosResponse<any, any>) => res)
        .catch((res: AxiosResponse<any, any>) => res)
    return res
}

export async function create(name: string) {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/subjects/create`, { name })
        .then((res: AxiosResponse<any, any>) => res)
        .catch((res: AxiosResponse<any, any>) => res)
    return res
}

export async function deleteById(id: number) {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/subjects/delete/${id}`)
        .then((res: AxiosResponse<any, any>) => res)
        .catch((res: AxiosResponse<any, any>) => res)
    return res
}

export async function updateById(id: number, name: string) {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/subjects/update/${id}`, { name: name })
        .then((res: AxiosResponse<any, any>) => res)
        .catch((res: AxiosResponse<any, any>) => res)
    return res
}

export async function getSubjectById(id: number) {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/subjects/get-id/${id}`)
        .then((res: AxiosResponse<any, any>) => res)
        .catch((res: AxiosResponse<any, any>) => res)
    return res
}

export async function checkSubjectName(name: string, id: number) {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/subjects/check-name/${name}/${id}`)
        .then((res: AxiosResponse<any, any>) => res)
        .catch((res: AxiosResponse<any, any>) => res)
    return res
}