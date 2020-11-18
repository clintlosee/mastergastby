import { useContext, useState } from 'react';

import OrderContext from '../components/OrderContext';
import attachNamesAndPrices from './attachNamesAndPrices';
import calculateOrderTotal from './calculateOrderTotal';
import formatMoney from './formatMoney';

export default function usePizza({ pizzas, values }) {
  // Create some state to hold order
  //* got rid of this line because we moved useState up to provider
  //* now we access both our state and our updater function (setOrder) via context
  // const [order, setOrder] = useState([]);

  const [order, setOrder] = useContext(OrderContext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [message, setMessage] = useState();

  // make a function to add things to order
  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza]);
  }

  // make a function to remove things to order
  function removeFromOrder(index) {
    setOrder([
      // everything before item we want to remove
      ...order.slice(0, index),
      // everything after item we want to remove
      ...order.slice(index + 1),
    ]);
  }

  //* function run when someone submits form
  async function submitOrder(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    //* gather all the data to send
    const body = {
      order: attachNamesAndPrices(order, pizzas),
      total: formatMoney(calculateOrderTotal(order, pizzas)),
      name: values.name,
      email: values.email,
      mapleSyrup: values.mapleSyrup,
    };

    //* send this data to serverless function when they check out
    const res = await fetch(
      // `${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`,
      `api/placeOrder`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    const text = JSON.parse(await res.text());

    //* check if everything worked
    if (res.status >= 400 && res.status < 600) {
      setLoading(false); // turn off loading
      setError(text.message);
    } else {
      // it worked
      setLoading(false); // turn off loading
      setMessage('Success! Come on down for your pizza!');
    }
  }

  return {
    order,
    addToOrder,
    removeFromOrder,
    submitOrder,
    error,
    loading,
    message,
  };
}
