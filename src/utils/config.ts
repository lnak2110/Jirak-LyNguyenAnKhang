import axios, { AxiosRequestConfig, AxiosHeaders } from 'axios';

export const {
  setStore,
  getStore,
  getStoreJson,
  eraseStore,
  setCookie,
  getCookie,
  eraseCookie,
} = {
  setStore: (name: string, value: any) => {
    if (typeof value !== 'string') {
      localStorage.setItem(name, JSON.stringify(value));
    }
    localStorage.setItem(name, value);
  },
  getStore: (name: string) => {
    if (localStorage.getItem(name)) {
      return localStorage.getItem(name);
    }
    return null;
  },
  getStoreJson: (name: string) => {
    if (localStorage.getItem(name)) {
      return JSON.parse(localStorage.getItem(name) as string);
    }
    return null;
  },
  eraseStore: (name: string) => {
    localStorage.removeItem(name);
  },
  setCookie: (name: string, value: any, days: number) => {
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  },
  getCookie: (name: string) => {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  eraseCookie: (name: string) => {
    document.cookie = name + '=; path=/;';
  },
};

export const http = axios.create({
  baseURL: process.env.REACT_APP_DOMAIN,
  timeout: 30000,
});

http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // config.headers = {
    //   ...config.headers,
    //   ['Authorization']: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
    //   ['TokenCybersoft']: process.env.REACT_APP_TOKEN_CYBERSOFT,
    // };
    (config.headers as AxiosHeaders)
      .set('Authorization', `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`)
      .set('TokenCybersoft', process.env.REACT_APP_TOKEN_CYBERSOFT);
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
