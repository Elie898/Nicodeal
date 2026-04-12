export default {
  routes: [
    {
      method: "GET",
      path: "/orders/my-orders",
      handler: "order.findMyOrders",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
