export const tooltipShowDelay = 0.4;

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

// export async function hash(string) {
//   const utf8 = new TextEncoder().encode(string);
//   const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   return hashArray
//     .map((bytes) => bytes.toString(16).padStart(2, "0"))
//     .join("");
// }

// export const getServerSideRefresh: GetServerSideProps = wrapper.getServerSideProps(
// 	(store) =>
// 		async (ctx) => {
// 			const { userReducer: { data }} = store.getState();
// 			console.log('data', data);
// 			await store.dispatch(authAPI.endpoints.userRefresh.initiate(null));
// 			return { props: {} };
// 		}
// );