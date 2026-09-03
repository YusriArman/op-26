import PrizeCard from "../components/PrizeCard";

const merchandise = [
  {
    name: "Lexa's Acrylic Keychain",
    price: "RM8",
    image: "/Lexa-Keychain.jpeg",
  },
  {
    name: "Kira's Acrylic Keychain",
    price: "RM8",
    image: "/Kira-Keychain.jpeg",
  },
  {
    name: "Elysia's Acrylic Keychain",
    price: "RM8",
    image: "/Elysia-Keychain.jpeg",
  },
  {
    name: "Cyrus' Acrylic Keychain",
    price: "RM8",
    image: "/Cyrus-Keychain.jpeg",
  },
  {
    name: "Rolly Totebag",
    price: "RM10",
  },
];

const luckyDrawPrizes = [
  {
    name: "Lexa's Acrylic Keychain",
    image: "/Lexa-Keychain.jpeg",
  },
  {
    name: "Kira's Acrylic Keychain",
    image: "/Kira-Keychain.jpeg",
  },
  {
    name: "Elysia's Acrylic Keychain",
    image: "/Elysia-Keychain.jpeg",
  },
  {
    name: "Cyrus' Acrylic Keychain",
    image: "/Cyrus-Keychain.jpeg",
  },
  {
    name: "Rolly Totebag",
  },
];

function Prizes() {
  return (
    <div className="w-full min-h-screen bg-[linear-gradient(to_bottom,rgba(0,8,27,0.58),rgba(0,8,27,0.50),rgba(0,8,27,0.65)),url('/bg.png')] bg-cover bg-center bg-fixed text-white">
      <div className="mx-auto max-w-5xl px-6 py-8">


        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8">
          <div className="pl-6 md:pl-12">
            <h1 className="text-4xl sm:text-5xl font-futura-heavy font-bold uppercase leading-tight">
              <span className="text-white">ELYSIUM</span>
              <br />
              <span className="text-[#00F0FF] drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]">MERCHANDISE</span>
            </h1>

            <p className="mt-4 text-lg font-futura-medium text-cyan-300">
              Take a piece of Elysium home with you.
            </p>

            <p className="mt-2 text-sm font-futura-book text-gray-300">
              Celebrate Orientation Party 2026 with exclusive Elysium merchandise featuring your favourite characters from the city!
            </p>

            <div className="relative mt-6 inline-block border border-[#E000FF]/60 px-6 py-4">
              <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-[#E000FF]" />
              <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-[#E000FF]" />
              <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[#E000FF]" />
              <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[#E000FF]" />
              <p className="text-center text-sm font-futura-heavy font-bold uppercase tracking-wide text-[#E000FF]">
                Limited Edition! Only available at Orientation Party 2026
              </p>
            </div>
          </div>

          <div className="flex justify-start">
            <img
              src="/Merch-Poster.png"
              alt="Elysium Merchandise Catalogue"
              className="max-w-full h-auto -ml-4 drop-shadow-[0_0_25px_rgba(0,240,255,0.25)]"
            />
          </div>

        </section>

        {/* Merchandise */}
        <section>
          <h2
            className="text-center text-2xl sm:text-3xl font-futura-heavy font-bold uppercase tracking-wide text-[#00F0FF]"
            style={{ textShadow: "0 0 10px rgba(0,240,255,0.6)" }}
          >
            Elysium Merchandise
          </h2>
          <p className="mt-2 text-center text-sm font-futura-book text-gray-300">
            8CM acrylic keychains and totebags, grab yours while supplies last!
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {merchandise.map((item) => (
              <PrizeCard
                key={item.name}
                name={item.name}
                price={item.price}
                image={item.image}
              />

            ))}
          </div>
        </section>

        {/* Lucky Draw */}
        <section className="mt-20">
          <h2
            className="text-center text-2xl sm:text-3xl font-futura-heavy font-bold uppercase tracking-wide text-[#00F0FF]"
            style={{ textShadow: "0 0 10px rgba(0,240,255,0.6)" }}
          >
            Orientation Party Lucky Draw Prizes
          </h2>
          <p className="mt-2 text-center text-sm font-futura-book text-gray-300">
            Spend. Collect. Win. Spend RM20+ at our vendors for a chance to win exclusive Elysium prizes.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {luckyDrawPrizes.map((item) => (
              <PrizeCard
                key={item.name}
                name={item.name}
                image={item.image}
              />
            ))}
          </div>
        </section>

        {/* How To Redeem */}
        <section className="mt-14 sm:mt-20 mb-14 sm:mb-20 rounded-none p-[1px] bg-gradient-to-r from-[#3cf6f7]/60 via-[#e139fa]/60 to-[#6045f4]/60 shadow-[0_0_25px_rgba(60,246,247,0.25)] relative">
          <div className="w-full h-full bg-[#090520]/80 backdrop-blur-md p-6 sm:p-8">
            <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-[#3cf6f7]" />
            <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-[#3cf6f7]" />
            <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[#3cf6f7]" />
            <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[#3cf6f7]" />

            <h3 className="text-base sm:text-lg font-futura-heavy font-bold uppercase tracking-[0.25em] text-[#3cf6f7] drop-shadow-[0_0_8px_rgba(60,246,247,0.7)]">
              HOW TO REDEEM?
            </h3>
            <p className="mt-1 text-xs font-futura-book text-gray-200 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              Follow these simple steps to stand a chance to win fantastic prizes!
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { n: 1, title: "SPEND RM20", body: "Purchase RM20 worth of goods at our vendors." },
                { n: 2, title: "DISPLAY YOUR TICKET", body: "Approach the Orientation Leaders' booth and give your ticket." },
                { n: 3, title: "WAIT & WIN", body: "Prizes will be gifted to the winner at the end of OP so stay tuned!" },
                { n: 4, title: "CLAIM PRIZE", body: "Winners receive their prizes at the end of Orientation Party 2026! Prizes are void if winners are not present, so be sure to stay for the whole thing!" },
              ].map((step) => (
                <div
                  key={step.n}
                  className="p-[1px] rounded-xl bg-gradient-to-br from-[#3cf6f7]/60 via-[#e139fa]/60 to-[#6045f4]/60 shadow-[0_0_15px_rgba(0,0,0,0.4)] transition duration-300 hover:from-[#3cf6f7] hover:to-[#6045f4]"
                >
                  <div className="rounded-[11px] bg-[#160b38]/90 backdrop-blur-sm p-4 h-full">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#6045f4] text-xs font-futura-heavy font-bold text-white mb-2 shadow-[0_0_8px_rgba(96,69,244,0.6)]">
                      {step.n}
                    </div>
                    <h4 className="text-sm font-futura-heavy font-bold text-[#3cf6f7] uppercase tracking-[0.15em]">
                      {step.title}
                    </h4>
                    <p className="mt-1 text-xs font-futura-book text-gray-200 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsors */}
        <section className="mt-14 sm:mt-20 mb-14 sm:mb-20">
          <h2
            className="text-center text-2xl sm:text-3xl font-futura-heavy font-bold uppercase tracking-wide text-[#00F0FF]"
            style={{ textShadow: "0 0 10px rgba(0,240,255,0.6)" }}
          >
            Our Sponsors
          </h2>
          <p className="mt-2 text-center text-sm font-futura-book text-gray-300">
            Sign up with our sponsors for exclusive freebies and deals at the event.
          </p>

          <div className="mt-8 space-y-6">

            {/* Sponsor 1: App sign-up → free ice cream */}
            <div className="p-[1px] rounded-xl bg-gradient-to-br from-[#00F0FF]/60 via-[#E000FF]/60 to-[#2596be]/60 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
              <div className="rounded-[11px] bg-[#160b38]/90 backdrop-blur-sm p-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-center">
                <div className="mx-auto md:mx-0 flex h-40 w-40 items-center justify-center rounded-xl border border-[#00F0FF]/50 bg-black/20 text-sm font-futura-book text-gray-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                  LOGO
                </div>

                <div>
                  <h3 className="text-lg font-futura-heavy font-bold text-[#00F0FF] uppercase tracking-[0.15em]">
                    Sponsor App
                  </h3>
                  <p className="mt-2 text-sm font-futura-book text-gray-200 leading-relaxed">
                    Sign up for Sponsor App to get a free scoop of Inside Scoop ice cream at their booth on the day!
                  </p>
                  <div className="mt-4 inline-block rounded-md bg-[#00F0FF]/10 border border-[#00F0FF]/40 px-4 py-2 text-center text-xs font-futura-heavy font-bold uppercase tracking-wide text-[#00F0FF]">
                    Free Ice Cream Scoop
                  </div>
                </div>
              </div>
            </div>

            {/* Sponsor 2: Custom TNG card */}
            <div className="p-[1px] rounded-xl bg-gradient-to-br from-[#00F0FF]/60 via-[#E000FF]/60 to-[#2596be]/60 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
              <div className="rounded-[11px] bg-[#160b38]/90 backdrop-blur-sm p-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-center">
                <div className="mx-auto md:mx-0 flex h-40 w-40 items-center justify-center rounded-xl border border-[#00F0FF]/50 bg-black/20 text-sm font-futura-book text-gray-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                  CARD
                </div>

                <div>
                  <h3 className="text-lg font-futura-heavy font-bold text-[#00F0FF] uppercase tracking-[0.15em]">
                    Custom Elysium TNG Card
                  </h3>
                  <p className="mt-2 text-sm font-futura-book text-gray-200 leading-relaxed">
                    Get your own custom-designed Touch 'n Go card! Redeem at the sponsor booth on the day.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <div className="rounded-md bg-[#00F0FF]/10 border border-[#00F0FF]/40 px-4 py-2 text-center text-xs font-futura-heavy font-bold uppercase tracking-wide text-[#00F0FF]">
                      First 300: Free
                    </div>
                    <div className="rounded-md bg-[#E000FF]/10 border border-[#E000FF]/40 px-4 py-2 text-center text-xs font-futura-heavy font-bold uppercase tracking-wide text-[#E000FF]">
                      After: RM20
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div >
    </div >

  );
}

export default Prizes;