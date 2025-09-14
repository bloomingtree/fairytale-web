import axios from 'axios'

export const getStoryList = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`/api/story?page=${page}&pageSize=${pageSize}`)
  return response.data
}

export const getStoryDetail = async (id) => {
  const response = await axios.get(`/api/story/${id}`)
  return response.data
}