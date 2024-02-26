export const base = "https://api-m.sandbox.paypal.com";
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
export const generateAccessToken = async () => {
  try {
    if (!client_id || !client_secret) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(client_id + ":" + client_secret).toString(
      "base64"
    );

    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(error);
  }
};

export const createOrder = async (cart) => {
  const accessToken = await generateAccessToken();
  const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders`;

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const items = cart.map((item) => {
    return {
      name: item.name,
      unit_amount: {
        currency_code: "USD",
        value: item.price,
      },
      quantity: 1,
    };
  });

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: getTotalPrice(),
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: getTotalPrice(),
            },
          },
        },

        items: items,
      },
    ],
  };

  //   const payload = {
  //     intent: "CAPTURE",
  //     purchase_units: [
  //       {
  //         amount: {
  //           currency_code: "USD",
  //           value: 100.0,
  //           breakdown: {
  //             item_total: {
  //               currency_code: "USD",
  //               value: 100.0,
  //             },
  //           },
  //         },
  //         items: [
  //           {
  //             name: "Example Product",
  //             unit_amount: {
  //               currency_code: "USD",
  //               value: 50.0,
  //             },
  //             quantity: 2,
  //           },
  //         ],
  //       },
  //     ],
  //   };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const handleResponse = async (response) => {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
};

export const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};
