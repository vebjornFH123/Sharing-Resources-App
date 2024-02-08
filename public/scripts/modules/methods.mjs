async function postTo(url, data) {
  const header = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const respon = await fetch(url, header);
  if (!respon.ok) {
    throw new Error(`HTTP error! status: ${respon.status}`);
  }
  return respon;
}

async function getData(url) {
  const respon = await fetch(url);
  if (!respon.ok) {
    throw new Error(`HTTP error! status: ${respon.status}`);
  }
  const data = await respon.json();

  return data;
}

export { postTo, getData };
