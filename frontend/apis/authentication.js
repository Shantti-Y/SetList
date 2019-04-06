import moment from 'moment';

export const setAuthenticationData = (accessToken, tokenType, expiresIn) => {
  console.log(accessToken);
  window.localStorage.setItem('access_token', accessToken);
  window.localStorage.setItem('token_type', tokenType);
  window.localStorage.setItem('expires_at', moment().seconds(expiresIn).format('x'));
};

export const getAuthenticationData = () => {
  return {
    access_token: window.localStorage.getItem('access_token'),
    token_type: window.localStorage.getItem('token_type'),
    expires_at: window.localStorage.getItem('expires_at')
  };
};

export const hasAuthenticationData = () => {
  return window.localStorage.getItem('access_token') !== undefined &&
    window.localStorage.getItem('token_type') !== undefined &&
    window.localStorage.getItem('expires_at') !== undefined;
};