const { defineStore } = Pinia;

import productStore from "./productStore.js";

export default defineStore("cart", {
  state() {
    return {
      cart: [],
    };
  },
  actions: {
    addToCart(productId, qty = 1) {
      // 判斷如果購物車有該項目車+1，沒有則是新增一個夠物車項目
      const currentCart = this.cart.find(
        (item) => item.productId === productId
      );

      if (currentCart) {
        currentCart.qty += qty;
      } else {
        this.cart.push({
          id: new Date().getTime(),
          productId,
          qty,
        });
      }
    },
    setCartQty(id, e){
      const currentCart = this.cart.find(item=>item.id===id);
      currentCart.qty = Number(e.target.value);
    },
    removeCartItem(id) {
      const index = this.cart.findIndex((item) => item.id === id);
      this.cart.splice(index, 1);
    },
  },
  getters: {
    cartList() {
      // 從productStore取得產品資料
      const { products } = productStore();

      const carts = this.cart.map((item) => {
        // 單一產品取出
        const product = products.find(
          (product) => product.id === item.productId
        );

        return {
          ...item,
          product,
          subtotal: product.price * item.qty,
        };
      });

      const total = carts.reduce((pre, cur) => pre + cur.subtotal, 0);

      return {
        carts,
        total,
      };
    },
  },
});
