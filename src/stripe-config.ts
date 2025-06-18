export const stripeConfig = {
  products: [
    {
      id: 'prod_STxQkiRCBwPYnm',
      priceId: 'price_1RYzVGKF5CQ6VVcW1R1mdbS1',
      name: 'One Coin Pack',
      description: 'Jumpstart your journey with a single coin—perfect for your first decision or swift impulse action. Instant access, no commitment required.',
      price: 0.99,
      coins: 1,
      mode: 'payment' as const,
      image: "https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
    },
    {
      id: 'prod_STxQbGrcemzmvr',
      priceId: 'price_1RYzVpKF5CQ6VVcWNygDiod0',
      name: 'Five Coin Pack',
      description: 'Get 5 coins at $1 each. Ideal for users wanting flexibility without overspending—stretch your influence in measured steps.',
      price: 4.99,
      coins: 5,
      mode: 'payment' as const,
      popular: true,
      image: "https://res.cloudinary.com/digjsdron/image/upload/v1749679801/Coin_5_on4iim.webp"
    },
    {
      id: 'prod_STxRzUhSFWQHc0',
      priceId: 'price_1RYzWQKF5CQ6VVcW2DmPgRuG',
      name: 'Twenty-Five Coin Pack',
      description: 'Go big with 25 coins at just $0.80 each. Designed for power users who know what they want and want value to back their moves.',
      price: 19.99,
      coins: 25,
      mode: 'payment' as const,
      image: "https://res.cloudinary.com/digjsdron/image/upload/v1749679801/Coin_10_xdrxde.webp"
    },
    {
      id: 'prod_STxR5t8pbEqSvv',
      priceId: 'price_1RYzWyKF5CQ6VVcWSPfnFnH0',
      name: 'Hundred Coin Pack',
      description: 'Maximize your impact with 100+ coins at a mere $0.60 each. For those ready to back multiple ideas or make bold, consistent decisions.',
      price: 59.99,
      coins: 100,
      mode: 'payment' as const,
      image: "https://res.cloudinary.com/digjsdron/image/upload/v1749679801/Coin_100_gv72lc.webp"
    }
  ]
};

type StripeProduct = typeof stripeConfig.products[0];