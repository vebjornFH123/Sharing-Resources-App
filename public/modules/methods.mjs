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
    const errorResponse = await respon.text();

    throw new Error(errorResponse);
  }

  return respon;
}

async function getData(url) {
  const respon = await fetch(url);
  if (!respon.ok) {
    const errorResponse = await respon.text();

    throw new Error(errorResponse);
  }
  const data = await respon.json();

  return data;
}

export { postTo, getData };
