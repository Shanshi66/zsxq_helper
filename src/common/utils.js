import MD5 from 'crypto-js/md5';

export function computeMd5(str) {
  return MD5(str).toString();
}