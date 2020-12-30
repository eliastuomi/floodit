import axios from 'axios'

const baseUrl = '/api/rooms'


const getAll = async () => {
    const response = await axios.get(`${baseUrl}`)
    return response
}

const create = async newRoom => {
    const response = await axios.post(baseUrl, newRoom)
    return response.data
}

const remove = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`)
    return response.data
}

const join = async (id, roomObject) => {
    const response = await axios.put(`${baseUrl}/${id}`, roomObject)
    return response.data
}



export default { getAll, create, remove, join }