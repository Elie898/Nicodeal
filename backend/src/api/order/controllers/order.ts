/**
 * order controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized(
            "Du måste vara inloggad för att skapa en order.",
          );
        }

        const body = ctx.request.body as {
          data?: {
            customerName?: string;
            customerEmail?: string;
            customerAddress?: string;
            customerPhone?: string;
            totalPrice?: number;
            orderItems?: unknown[];
            orderStatus?: "pending" | "confirmed" | "shipped" | "completed";
          };
        };

        if (!body?.data) {
          return ctx.badRequest("Orderdata saknas.");
        }

        const createdOrder = await strapi.entityService.create(
          "api::order.order",
          {
            data: {
              customerName: body.data.customerName,
              customerEmail: body.data.customerEmail,
              customerAddress: body.data.customerAddress,
              customerPhone: body.data.customerPhone,
              totalPrice: body.data.totalPrice,
              orderItems: body.data.orderItems || [],
              orderStatus: body.data.orderStatus || "pending",
              user: user.id,
            },
            populate: ["orderItems", "user"],
          },
        );

        return { data: createdOrder };
      } catch (error) {
        strapi.log.error("Order create error:", error);
        return ctx.internalServerError("Kunde inte skapa ordern.");
      }
    },

    async findMyOrders(ctx) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized("Du måste vara inloggad.");
        }

        const orders = await strapi.entityService.findMany("api::order.order", {
          filters: {
            user: {
              id: user.id,
            },
          },
          populate: ["orderItems", "user"],
          sort: { createdAt: "desc" },
        });

        return { data: orders };
      } catch (error) {
        strapi.log.error("Find my orders error:", error);
        return ctx.internalServerError("Kunde inte hämta användarens ordrar.");
      }
    },
  }),
);
