type FooterProps = {
  topGap?: number;
};

export const Footer = ({ topGap = 220 }: FooterProps) => {
  return (
    <>
      <div style={{ height: topGap }} aria-hidden />

      <footer className="w-full bg-black text-white">
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
    </>
  );
};
