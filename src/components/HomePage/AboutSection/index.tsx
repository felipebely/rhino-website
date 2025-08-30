import { FadeInImg } from "../../FadeInImage";

export function AboutSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto px-4 sm:px-6 py-24 max-w-6xl">
        {/* Section 1: text left, image right (top-aligned) */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
          style={{ ["--h-sm"]: "65vw", ["--h"]: "28vw" } as CSSVars}
        >
          {/* Text */}
          <div className="self-start">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'DM Serif Text', serif" }}
            >
              Quem Somos
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ fontFamily: "'DM Serif Text', serif" }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          {/* Image */}
          <FadeInImg
            src="/pictures/pic_7.jpg"
            alt="Quem Somos"
            className="relative w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)]"
            imgClassName="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Section 2: image left, text right (top-aligned) */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mt-24"
          style={{ ["--h-sm"]: "65vw", ["--h"]: "28vw" } as CSSVars}
        >
          {/* Image */}
          <FadeInImg
            src="/pictures/pic_8.jpg"
            alt="Nosso Projeto"
            className="relative w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)] order-1 md:order-none"
            imgClassName="absolute inset-0 w-full h-full object-cover"
          />
          {/* Text */}
          <div className="order-2 md:order-none self-start">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'DM Serif Text', serif" }}
            >
              Nosso Projeto
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ fontFamily: "'DM Serif Text', serif" }}
            >
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
              est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
              velit, sed quia non numquam eius modi tempora incidunt ut labore
              et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
              veniam, quis nostrum exercitationem ullam corporis suscipit
              laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem
              vel eum iure reprehenderit qui in ea voluptate velit esse quam
              nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
              voluptas nulla pariatur?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
