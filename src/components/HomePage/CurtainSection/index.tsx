import { FadeInImg } from "../../FadeInImage";

export function CurtainSection() {
  // ===== Proportional system (desktop heights in vw; mobile unified & taller) =====
  const MOBILE_H = 120; // all mobile images same tall height (in vw)
  const PIC1_H = 46; // desktop hero height
  const TWO_THIRDS = (2 / 3) * PIC1_H; // ~30.67vw
  const FIVE_SIXTHS = (5 / 6) * PIC1_H; // ~38.33vw

  // Row 1
  const PIC2_H = TWO_THIRDS;
  const PIC2_TOP_OFFSET = PIC1_H / 3;

  // Row 2
  const PIC5_H = FIVE_SIXTHS; // Camarões
  const PIC4_H = TWO_THIRDS; // Bolo
  const PIC4_TOP_OFFSET = PIC5_H / 3;

  // Row 3
  const PIC3_H = TWO_THIRDS; // Lombo
  const PIC6_H = FIVE_SIXTHS; // Pêssegos
  const PIC6_TOP_OFFSET = PIC3_H / 3;

  const captionStyle: React.CSSProperties = {
    fontFamily: "'DM Serif Text', serif",
    fontWeight: "bold",
    //fontStyle: "italic",
  };

  return (
    <div className="mx-auto px-4 sm:px-6 py-12 space-y-24">
      {/* ---------- ROW 1 (pics 1 & 2) ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(5vw,1fr)_minmax(30vw,38vw)_minmax(9vw,12vw)_minmax(28vw,34vw)_minmax(5vw,1fr)] items-start gap-y-10 md:gap-y-0">
        {/* pic_1 (hero) */}
        <figure className="group md:col-start-2 md:col-end-3 flex flex-col items-center md:items-start">
          <FadeInImg
            src="/pictures/pic_1.jpg"
            alt="pic_1"
            className="relative w-[92vw] md:w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)]"
            imgClassName="absolute inset-0 w-full h-full object-cover"
            style={
              {
                ["--h-sm"]: `${MOBILE_H}vw`,
                ["--h"]: `${PIC1_H}vw`,
              } as CSSVars
            }
          />
          <figcaption
            className="mt-3 text-base opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out select-none text-left w-full"
            style={captionStyle}
          >
            Espuma Cremoux de Chocolate branco com Tartar de Cítricos & Citrus
            Bergamia
          </figcaption>
        </figure>

        {/* pic_2 */}
        <figure className="group md:col-start-4 md:col-end-5 flex flex-col items-center md:items-end">
          <FadeInImg
            src="/pictures/pic_2.jpg"
            alt="pic_2"
            className="relative w-[92vw] md:w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)] mt-0 md:mt-[var(--mt)]"
            imgClassName="absolute inset-0 w-full h-full object-cover"
            style={
              {
                ["--h-sm"]: `${MOBILE_H}vw`,
                ["--h"]: `${PIC2_H}vw`,
                ["--mt"]: `${PIC2_TOP_OFFSET}vw`,
              } as CSSVars
            }
          />
          <figcaption
            className="mt-3 text-base opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out select-none text-left w-full md:text-right"
            style={captionStyle}
          >
            Pizza de Queijo Brie, Mel, Amêndoas, e Damasco com Alecrim
          </figcaption>
        </figure>
      </div>

      {/* ---------- ROW 2 (pics 5 & 4) ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(5vw,1fr)_minmax(28vw,34vw)_minmax(9vw,12vw)_minmax(30vw,38vw)_minmax(5vw,1fr)] items-start gap-y-10 md:gap-y-0">
        {/* pic_5 — Camarões (5/6) */}
        <figure className="group md:col-start-2 md:col-end-3 flex flex-col items-center md:items-start">
          <FadeInImg
            src="/pictures/pic_5.jpg"
            alt="pic_5"
            className="relative w-[92vw] md:w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)] mt-0 md:-mt-[1vw]"
            imgClassName="absolute inset-0 w-full h-full object-cover"
            style={
              {
                ["--h-sm"]: `${MOBILE_H}vw`,
                ["--h"]: `${PIC5_H}vw`,
              } as CSSVars
            }
          />
          <figcaption
            className="mt-3 text-base opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out select-none text-left w-full"
            style={captionStyle}
          >
            Camarões Borrachitos, Guanciale & Riso Al Salto
          </figcaption>
        </figure>

        {/* pic_4 — Bolo (2/3), dropped by one-third of pic_5 */}
        <figure className="group md:col-start-4 md:col-end-5 flex flex-col items-center md:items-end">
          <FadeInImg
            src="/pictures/pic_4.jpg"
            alt="pic_4"
            className="relative w-[92vw] md:w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)] mt-0 md:mt-[var(--mt)]"
            imgClassName="absolute inset-0 w-full h-full object-cover"
            style={
              {
                ["--h-sm"]: `${MOBILE_H}vw`,
                ["--h"]: `${PIC4_H}vw`,
                ["--mt"]: `${PIC4_TOP_OFFSET}vw`,
              } as CSSVars
            }
          />
          <figcaption
            className="mt-3 text-base opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out select-none text-left w-full md:text-right"
            style={captionStyle}
          >
            Bolo de nozes e especiarias, Cremoux 45% Mocaccino e Praline de
            nozes, Cremoux Doce de Leite com Manjericão e Gel de Tâmaras e
            Alcatrão
          </figcaption>
        </figure>
      </div>

      {/* ---------- ROW 3 (pics 3 & 6) ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(5vw,1fr)_minmax(30vw,36vw)_minmax(9vw,12vw)_minmax(30vw,38vw)_minmax(5vw,1fr)] items-start gap-y-10 md:gap-y-0">
        {/* pic_3 — Lombo (2/3)*/}
        <figure className="group md:col-start-2 md:col-end-3 flex flex-col items-center md:items-start">
          <FadeInImg
            src="/pictures/pic_3.jpg"
            alt="pic_3"
            className="relative w-[92vw] md:w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)] mt-0 md:mt-[4vw]"
            imgClassName="absolute inset-0 w-full h-full object-cover"
            style={
              {
                ["--h-sm"]: `${MOBILE_H}vw`,
                ["--h"]: `${PIC3_H}vw`,
              } as CSSVars
            }
          />
          <figcaption
            className="mt-3 text-base opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out select-none text-left w-full"
            style={captionStyle}
          >
            Lombo de Bacalhau & Beurre Blanc de Cítricos com Tucupi
          </figcaption>
        </figure>

        {/* pic_6 — Pêssegos (5/6), dropped by one-third of pic_3 */}
        <figure className="group md:col-start-4 md:col-end-5 flex flex-col items-center md:items-end">
          <FadeInImg
            src="/pictures/pic_6.jpg"
            alt="pic_6"
            className="relative w-[92vw] md:w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)] mt-0 md:mt-[var(--mt)]"
            imgClassName="absolute inset-0 w-full h-full object-cover"
            style={
              {
                ["--h-sm"]: `${MOBILE_H}vw`,
                ["--h"]: `${PIC6_H}vw`,
                ["--mt"]: `${PIC6_TOP_OFFSET}vw`,
              } as CSSVars
            }
          />
          <figcaption
            className="mt-3 text-base opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out select-none text-left w-full md:text-right"
            style={captionStyle}
          >
            Pêssegos Amarelos em Brasa & Burrata
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
