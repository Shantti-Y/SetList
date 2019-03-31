import client from './client';
import { getAuthenticationData } from '@apis/authentication';

export const createPlaylist = async (condition, playlist_id) => {
  const { data } = await client.post(`/initialize_playlist`, {
    condition: condition,
    playlist_id: playlist_id,
    authentication: getAuthenticationData()
  });
  return data;
};

export const checkAuth = async () => {
  await client.post('/check_auth', {
    ...getAuthenticationData()
  });
};