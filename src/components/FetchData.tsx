import { SERVER } from '../services/ApiUrls'

export const getHeader = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('Token'),
  org: localStorage.getItem('org')
})

export const getHeader1 = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('Token')
})

// Keep old exports for backward compatibility
export const Header = getHeader()
export const Header1 = getHeader1()

export function fetchData(url: any, method: any, data = null as any, header: any) {
  return fetch(`${SERVER}${url}`, {
    method,
    headers: header,
    body: data
  }).then((response) => response.json())
}