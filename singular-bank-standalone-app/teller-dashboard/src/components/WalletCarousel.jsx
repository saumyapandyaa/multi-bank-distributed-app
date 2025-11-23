import React from "react";
import WalletCard from "./WalletCard";

export default function WalletCarousel({ cards }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">My Wallet</h2>

      <div className="relative h-44">
        {cards.map((card, index) => (
          <div
            key={index}
            className="absolute transition-all duration-500"
            style={{
              left: `${index * 40}px`,
              opacity: index === 0 ? 1 : 0.5,
              transform: index === 0 ? "scale(1)" : "scale(0.9)",
              zIndex: 10 - index
            }}
          >
            <WalletCard
              name={card.name}
              number={card.number}
              expiry={card.expiry}
              bg={card.bg}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
