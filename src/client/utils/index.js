import { RouteNames } from '../router';

export const getDateStr = (date) => {
  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
  const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const year = date.getFullYear();

  const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
  const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const pxToNumber = (string) => {
  return Number(string.replace(/px/g, ''));
};

export const getLinks = (string) => {
  const links = [{ title: 'Все файлы', href: RouteNames.CLOUD }];

  if (string !== '/') {
    const arrFromString = string.split('/');
    for (let i = 1; i < arrFromString.length; i++) {
      links.push({ title: arrFromString[i], href: `${RouteNames.CLOUD}?path=/${arrFromString[i]}` });
    }
  }

  return links;
};

// export async function hash(string) {
//   const utf8 = new TextEncoder().encode(string);
//   const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   return hashArray
//     .map((bytes) => bytes.toString(16).padStart(2, "0"))
//     .join("");
// }