import React, { useState } from 'react';

// Create order context
const OrderContext = React.createContext();

export function OrderProvider({ children }) {
  // need to stick state in here
  const [order, setOrder] = useState([]);
  return (
    <OrderContext.Provider value={[order, setOrder]}>
      {children}
    </OrderContext.Provider>
  );
}
export default OrderContext;
