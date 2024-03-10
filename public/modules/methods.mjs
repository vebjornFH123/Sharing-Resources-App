async function postTo(url, data, dataType) {
  console.log(dataType == "JSON" ? JSON.stringify(data) : data);
  let headers = {};

  if (dataType === "JSON") {
    headers = {
      "Content-Type": "application/json",
    };
  } else {
    // No need to set Content-Type for FormData, it will be set automatically
  }

  const header = {
    method: "POST",
    body: dataType == "JSON" ? JSON.stringify(data) : data,
    headers: headers,
  };
  const respon = await fetch(url, header);
  if (!respon.ok) {
    const errorResponse = await respon.text();

    throw new Error(errorResponse);
  }

  return respon;
}

async function getData(url) {
  const header = {
    method: "GET",
  };
  const respon = await fetch(url, header);

  if (!respon.ok) {
    const errorResponse = await respon.text();

    throw new Error(errorResponse);
  }
  return respon;
}

async function deleteData(url) {
  const header = {
    method: "DELETE",
  };
  const respon = await fetch(url, header);

  if (!respon.ok) {
    const errorResponse = await respon.text();

    throw new Error(errorResponse);
  }
  return respon.text();
}

export { postTo, deleteData, getData };
