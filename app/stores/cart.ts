
export const useCartStore = defineStore("cartStore", {
  state: () => ({
    item: {} as CartItem ,
  }),

  persist: {
    key: "cartStore",
    pick: ["item"],     
   
  },

  actions: {
    addToCart(item: CartItem) {
     this.item = item
    },
    resetCart() {
      this.item = {} as CartItem
    }
  },
})
