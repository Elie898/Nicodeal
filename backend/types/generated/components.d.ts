import type { Schema, Struct } from '@strapi/strapi';

export interface OrderOrderItem extends Struct.ComponentSchema {
  collectionName: 'components_order_order_items';
  info: {
    displayName: 'order-item';
  };
  attributes: {
    imageUrl: Schema.Attribute.String;
    productName: Schema.Attribute.String;
    purchaseType: Schema.Attribute.String;
    quantity: Schema.Attribute.Integer;
    unitPrice: Schema.Attribute.Decimal;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'order.order-item': OrderOrderItem;
    }
  }
}
