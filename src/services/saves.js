import axios from 'axios'

const baseUrl = '/api/saves'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = async () => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.get(`${baseUrl}`, config)
    return response
}

const create = async newObject => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const getRecent = async () => {
    const response = await axios.get(`${baseUrl}/one`)
    return response.data
}

const getId = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}


export default { getAll, create, getRecent, getId, setToken }