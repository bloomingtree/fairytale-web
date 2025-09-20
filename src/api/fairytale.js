import axios from 'axios'

export const getStoryList = async (page = 0, pageSize = 10) => {
  const response = await axios.get(import.meta.env.VITE_API_URL + `/api/story?page=${page}&pageSize=${pageSize}`)
  return response.data
}

export const getStoryDetail = async (id) => {
  const response = await axios.get(import.meta.env.VITE_API_URL + `/api/story/${id}`)
  return response.data
}