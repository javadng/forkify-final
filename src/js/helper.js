import { TIMEOUT_SEC } from './config.js';

const Timeout = async function (s) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error('Request took too long! :('));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, Timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`💥${data.message}, ${res.status}`);
    return data;
  } catch (err) {
    // console.log(err.message);
    throw err;
  }
};
