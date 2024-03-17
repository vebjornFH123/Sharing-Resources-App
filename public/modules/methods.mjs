const dataOptions = {
  json: "JSON",
};

async function postTo(url, data, dataType) {
  let headers = {};

  if (dataType === dataOptions.json) {
    headers = {
      "Content-Type": "application/json",
    };
  } else {
    // No need to set Content-Type for FormData, it will be set automatically
  }

  const header = {
    method: "POST",
    body: dataType == dataOptions.json ? JSON.stringify(data) : data,
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

async function deleteData(url, data) {
  const header = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url, header);

  if (!response.ok) {
    const errorResponse = await response.text();
    throw new Error(errorResponse);
  }

  return response.text();
}

export { postTo, deleteData, getData, dataOptions };
