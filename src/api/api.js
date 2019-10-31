import Axios from 'axios'

const api = async ({baseURL = window.API_ROOT, url = '', params = {}, args = {}, method = 'GET', success = () => {}, error = () => {}} = {}) => {
  url = url.startsWith('/') ? baseURL + url : baseURL + '/' + url
  switch (method = method.toUpperCase()) {
    case 'POST':
      return Axios.post(url, params).then(response => {
        success(response, args)
        return response.data
      }).catch(response => {
        error(response, args)
        return response.data
      })
    case 'DELETE':
      return Axios.delete(url, params).then(response => {
        success(response, args)
        return response.data
      }).catch(response => {
        error(response, args)
        return response.data
      })
    case 'PUT':
      return Axios.put(url, params).then(response => {
        success(response, args)
        return response.data
      }).catch(response => {
        error(response, args)
        return response.data
      })
    case 'GET': default:
      return Axios.get(url, { params }).then(response => {
        success(response, args)
        return response.data
      }).catch(response => {
        error(response, args)
        return response.data
      })
  }
}

export { api }
