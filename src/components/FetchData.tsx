import { SERVER } from '../services/ApiUrls';

export const Header = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('Token'),
    org: localStorage.getItem('org'),
};

export const Header1 = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('Token'),
};

export function fetchData(url: any, method: any, data = null as any, header: any) {
    const freshHeaders = {
        ...header,
        Authorization: localStorage.getItem('Token'),
        org: localStorage.getItem('org'),
    };

    return fetch(`${SERVER}${url}`, {
        method,
        headers: freshHeaders,
        body: data,
    }).then((response) => response.json());
}
