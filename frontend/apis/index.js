import client from './client';

const authenticationData = {
  access_token: window.localStorage.getItem('access_token'),
  token_type: window.localStorage.getItem('token_type'),
  expires_in: window.localStorage.getItem('expires_in'),
  expires_at: window.localStorage.getItem('expires_at')
}

export const createPlaylist = async condition => {
  const { data } = await client.post(`/initialize_playlist`, {
    condition: condition,
    authentication: authenticationData
  });
  return data
};

export const checkAuth = async () => {
  const { data } = await client.post('/check_auth', {
    ...authenticationData
  });
}