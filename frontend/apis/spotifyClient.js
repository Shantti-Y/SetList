import client from './client';

export const createPlaylist = async condition => {
  const { data } = await client.get(`/api/create_playlist/`, {
    params: condition
  });
  return data
}
