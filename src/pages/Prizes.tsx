import Header from "../components/Header";
import PrizeCard from "../components/PrizeCard";

const merchandise = [
  {
    name: "Lexa's Acrylic Keychain",
    price: "RM8",
  },
  {
    name: "Kira's Acrylic Keychain",
    price: "RM8",
  },
  {
    name: "Elysia's Acrylic Keychain",
    price: "RM8",
  },
  {
    name: "Cyrus' Acrylic Keychain",
    price: "RM8",
  },
  {
    name: "Rolly Totebag",
    price: "RM10",
  },
];

const luckyDrawPrizes = [
  {
    name: "Lexa's Acrylic Keychain",
  },
  {
    name: "Kira's Acrylic Keychain",
  },
  {
    name: "Elysia's Acrylic Keychain",
  },
  {
    name: "Cyrus' Acrylic Keychain",
  },
  {
    name: "Rolly Totebag",
  },
];

function Prizes() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Merchandise */}
      <section>
        <Header
          title="ELYSIUM MERCHANDISE"
          align="center"
        />

        <div className="flex flex-wrap justify-center gap-4">
          {merchandise.map((item) => (
            <PrizeCard
              key={item.name}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      </section>

      {/* Lucky Draw */}
      <section className="mt-20">
        <Header
          title="ORIENTATION PARTY LUCKY DRAW PRIZES"
          align="left"
        />

        <div className="flex flex-wrap justify-center gap-4">
          {luckyDrawPrizes.map((item) => (
            <PrizeCard
              key={item.name}
              name={item.name}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Prizes;