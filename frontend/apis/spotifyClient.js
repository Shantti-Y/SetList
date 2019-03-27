import client from './client';

export const createPlaylist = async condition => {
  const { data } = await client.get(`/api/initialize_playlist`, {
    params: condition
  });
  return data
};

export const startPlaylist = async () => {
  const { data } = await client.get(`/api/start_playlist`);
  return data
};