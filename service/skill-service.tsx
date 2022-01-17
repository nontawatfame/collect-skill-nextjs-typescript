import axios from "axios"

export async function getApiSubjects(pages: number, size: number) {
    const res = await axios(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/subjects/${pages}/${size}`)
    const data = await res.data
    return data
}

export async function create(name: string) {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/subjects/create`, {name})
    return res
}

export async function deleteById(id: number) {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/subjects/delete/${id}`)
    return res
}

export async function updateById(id: number, name: string) {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/subjects/update/${id}`, {name: name})
    return res
}

export async function getSubjectById(id: number) {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_API_NEXT}/subjects/get-id/${id}`)
    const data = await res.data
    return data
}