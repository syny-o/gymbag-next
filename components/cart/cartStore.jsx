import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],

  // --- actions pro košík ---
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);

      if (existingItem) {
        // 🔁 Pokud už produkt existuje → zvýš množství
        const updatedCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity ?? 1) + (product.quantity ?? 1) }
            : item
        );
        return { cart: updatedCart };
      } else {
        // 🆕 Jinak přidej nový produkt s quantity = 1 (pokud není definováno)
        return { cart: [...state.cart, { ...product, quantity: product.quantity ?? 1 }] };
      }
    }),

  removeFromCart: (product) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== product.id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      ),
    })),

  clearCart: () => set({ cart: [] }),

  // --- doprava (konfigurace + stav) ---
  shipping: {
    method: "standard",
    methods: {
      standard: { label: "Standard", price: 99, freeEligible: true, freeOver: 1000 },
      express: { label: "Express", price: 199, freeEligible: false, freeOver: null },
      pickup: { label: "Osobní odběr", price: 0, freeEligible: true, freeOver: 0 },
    },
  },

  setShippingMethod: (method) =>
    set((state) => ({ shipping: { ...state.shipping, method } })),

  updateShippingConfig: (method, partialCfg) =>
    set((state) => ({
      shipping: {
        ...state.shipping,
        methods: {
          ...state.shipping.methods,
          [method]: { ...state.shipping.methods[method], ...partialCfg },
        },
      },
    })),

  // --- výpočty ---
  calculateSubtotal: () => {
    const { cart } = get();
    return cart.reduce(
      (sum, item) => sum + item.price * (item.quantity ?? 1),
      0
    );
  },

  calculateShipping: () => {
    const subtotal = get().calculateSubtotal();
    const { method, methods } = get().shipping;
    const cfg = methods[method];
    if (!cfg) return 0;

    if (cfg.price === 0) return 0;
    if (cfg.freeEligible && cfg.freeOver != null && subtotal >= cfg.freeOver)
      return 0;

    return cfg.price;
  },

  calculateTotal: () => {
    const sub = get().calculateSubtotal();
    const ship = get().calculateShipping();
    return sub + ship;
  },
}));

export default useCartStore;
