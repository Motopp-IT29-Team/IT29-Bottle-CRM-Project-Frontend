import { SERVER } from '../services/ApiUrls'

export const Header = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('Token'),
  org: localStorage.getItem('org')
}

export const Header1 = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('Token')
}

// export function fetchData(url: any, method: any, data = '', header: any) {
//   return fetch(`${SERVER}${url}`, {
//     method,
//     headers: header,
//     body: data
//   }).then((response) => response.json())
// }

export function fetchData(url: any, method: any, data: any = '', header: any) {
  const upperMethod = (method || '').toString().toUpperCase();

  const options: any = {
    method: upperMethod,
    headers: header,
  };

  // Only attach body for non-GET methods
  if (upperMethod !== 'GET' && data !== undefined && data !== null && data !== '') {
    options.body = data;
  }

  return fetch(`${SERVER}${url}`, options)
    .then((response) => {
      // optional: help debug bad responses
      // console.log('fetchData', `${SERVER}${url}`, response.status);
      return response.json();
    });
}

