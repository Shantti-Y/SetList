
import { setAuthenticationData } from '@apis/authentication';

const paramsFromURI = () => {
  const hash = {};
  location.search.replace(/^\?/, '').split('&').map(q => {
    var spl = q.indexOf('=');
    if (spl != -1) {
      hash[q.substring(0, spl)] = decodeURIComponent(q.substring(spl + 1));
    }
  });
  return hash;
};
    
window.onload = async () => {
  const authorizationData = paramsFromURI();
  setAuthenticationData(authorizationData.access_token, authorizationData.token_type, authorizationData.expires_in);
  window.close();
};