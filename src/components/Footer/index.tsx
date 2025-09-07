type FooterProps = {
  topGap?: number;
};

export const Footer = ({ topGap = 220 }: FooterProps) => {
  return (
    <footer className="w-full bg-black text-white mt-28 z-20">
      <div
        className="mx-auto px-6 flex items-center justify-center"
        style={{ height: "224px" }}
      >
        <img
          src="/logos/logo_black_2.jpg"
          alt="Rhino Footer Logo"
          className="max-h-[220px] w-auto object-contain"
        />
      </div>
    </footer>
  );
};
