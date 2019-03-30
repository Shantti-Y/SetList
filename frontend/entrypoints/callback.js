import moment from 'moment';

const paramsFromURI = () => {
  const hash = {};
  location.search.replace(/^\?/, '').split('&').map(q => {
    var spl = q.indexOf('=');
    if (spl != -1) {
      hash[q.substring(0, spl)] = decodeURIComponent(q.substring(spl + 1));
    }
  });
  return hash;
}
    
window.onload = async () => {
  const authorizationData = paramsFromURI();
  window.localStorage.setItem('access_token', authorizationData.access_token);
  window.localStorage.setItem('token_type', authorizationData.token_type);
  window.localStorage.setItem('expires_at', moment().seconds(authorizationData.expires_in).format('x'));
  window.close();
};