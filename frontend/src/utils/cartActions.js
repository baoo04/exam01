import * as cartApi from "../api/cartApi";

function unwrap(data) {
  return data?.results ?? data ?? [];
}

function stripItem(it) {
  const { id: _id, cart: _c, ...rest } = it;
  return rest;
}

export async function addProductToCart(
  customerId,
  product,
  productType,
  quantity = 1
) {
  const listResp = await cartApi.listForCustomer(customerId, { limit: 50 });
  const carts = unwrap(listResp);
  const line = {
    product_id: product.id,
    product_type: productType,
    product_name: product.name,
    quantity: Number(quantity) || 1,
    unit_price: product.price,
  };

  if (carts.length === 0) {
    return cartApi.create({ customer_id: customerId, items: [line] });
  }

  const cart = carts[0];
  const prev = (cart.items || []).map(stripItem);
  const idx = prev.findIndex(
    (x) =>
      String(x.product_id) === String(line.product_id) &&
      x.product_type === line.product_type
  );
  if (idx >= 0) {
    prev[idx] = {
      ...prev[idx],
      quantity: Number(prev[idx].quantity) + line.quantity,
      unit_price: line.unit_price,
    };
  } else {
    prev.push(line);
  }
  return cartApi.update(cart.id, { customer_id: customerId, items: prev });
}
