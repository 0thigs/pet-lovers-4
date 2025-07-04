import type { IApiClient } from '@pet-lovers/core/interfaces'
import { ApiResponse } from '@pet-lovers/core/responses'

import { handleApiError } from '../utils'

export const ApiClient = (): IApiClient => {
  let baseUrl: string
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  let params: Record<string, string> = {}

  return {
    async get<ResponseBody>(url: string, body: unknown) {
      const response = await fetch(`${baseUrl}${url}`, {
        method: 'GET',
        headers,
        body: JSON.stringify(body),
      })
      params = {}
      const data = await response.json()

      if (response.status >= 400) {
        return handleApiError<ResponseBody>(data, response.status)
      }

      return new ApiResponse<ResponseBody>({
        body: data,
        statusCode: response.status,
      })
    },

    async post<ResponseBody>(url: string, body: unknown) {
      const response = await fetch(`${baseUrl}${url}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })
      params = {}

      if (response.status >= 400) {
        return handleApiError<ResponseBody>({}, response.status)
      }

      return new ApiResponse<ResponseBody>({
        statusCode: response.status,
      })
    },

    async put<ResponseBody>(url: string, body: unknown) {
      const response = await fetch(`${baseUrl}${url}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      })
      params = {}

      if (response.status >= 400) {
        return handleApiError<ResponseBody>({}, response.status)
      }

      return new ApiResponse<ResponseBody>({
        statusCode: response.status,
      })
    },

    async delete(url: string, body: unknown) {
      const response = await fetch(`${baseUrl}${url}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify(body),
      })
      params = {}

      if (response.status >= 400) {
        return handleApiError({}, response.status)
      }

      return new ApiResponse({
        statusCode: response.status,
      })
    },

    setBaseUrl(url: string) {
      baseUrl = url
    },

    setHeader(key: string, value: string) {
      headers[key] = value
    },

    setParam(key: string, value: string) {
      params[key] = value
    },
  }
}
