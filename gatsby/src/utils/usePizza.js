import { useContext, useState } from 'react';

import OrderContext from '../components/OrderContext';

export default function usePizza({ pizzas, inputs }) {
  // Create some state to hold order
  //* got rid of this line because we moved useState up to provider
  //* now we access both our state and our updater function (setOrder) via context
  // const [order, setOrder] = useState([]);

  const [order, setOrder] = useContext(OrderContext);

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

  // send this data to serverless function when they check out
  // TODO

  return {
    order,
    addToOrder,
    removeFromOrder,
  };
}
