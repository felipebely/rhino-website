export function Newsletter() {
  return (
    <main className="bg-white min-h-screen px-6 py-16 max-w-4xl mx-auto font-work-sans">
      {/* Post Header */}
      <section className="mb-16 text-left">
        <h1 className="text-4xl font-bold mb-2">Sample Newsletter Title</h1>
        <p className="text-gray-700 text-lg">By RhinoCozinha Editorial</p>
        <p className="text-gray-500 text-md">January 15, 2025</p>
      </section>

      {/* Post Body */}
      <section className="prose prose-lg text-gray-800 leading-relaxed mb-24">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed nunc eget
          mi facilisis tincidunt. Integer bibendum purus sed est suscipit, vitae
          luctus lorem vehicula. Nulla facilisi. Maecenas gravida interdum nibh nec
          consequat. Vivamus placerat, elit ut vulputate aliquet, lacus orci dapibus
          tortor, id pharetra odio lorem sed sapien.
        </p>
        <p>
          Suspendisse potenti. Donec aliquet ipsum sit amet purus gravida, a rutrum
          lectus volutpat. Vestibulum ante ipsum primis in faucibus orci luctus et
          ultrices posuere cubilia curae; Sed in urna nec sapien commodo ultricies.
          Sed eget pellentesque velit. Duis non lorem a est dapibus feugiat.
        </p>
        <p>
          Aliquam erat volutpat. Aenean non scelerisque odio, vitae viverra urna. Sed
          pharetra efficitur dui, sit amet faucibus tortor fermentum eget. Etiam
          mollis mi vel sem ultricies, vel convallis libero dictum.
        </p>
      </section>

      {/* All Newsletters */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-2 text-center">All Newsletters</h2>
        <p className="text-center text-gray-600 mb-10">
          Read past issues of the Rhino Newsletter.
        </p>

        {/* 2025 */}
        <div className="mt-10">
          <div className="grid grid-cols-[70px_70px_minmax(0,1fr)] gap-x-10 gap-y-3 text-sm">
            {/* Row 1 */}
            <span className="text-xl font-bold text-black self-start">2025</span>
            <span className="text-sm font-semibold text-gray-400 self-center">15/01</span>
            <span className="text-lg font-semibold text-black cursor-pointer px-1 py-1 hover:bg-yellow-100 hover:underline underline-offset-2 decoration-yellow-600">
              On having high standards, the secret to willpower, and how to be strong yet flexible
            </span>

            {/* Row 2 */}
            <span className="self-center" />
            <span className="text-sm font-semibold text-gray-400 self-center">08/01</span>
            <span className="text-lg font-semibold text-black cursor-pointer px-1 py-1 hover:bg-yellow-100 hover:underline underline-offset-2 decoration-yellow-600">
              On the best type of risk, three keys to improvement, and the purest form of generosity
            </span>

            {/* Row 3 */}
            <span className="self-center" />
            <span className="text-sm font-semibold text-gray-400 self-center">18/12</span>
            <span className="text-lg font-semibold text-black cursor-pointer px-1 py-1 hover:bg-yellow-100 hover:underline underline-offset-2 decoration-yellow-600">
              How to gain a competitive edge, cultivating small productive habits, and a call to self-acceptance
            </span>

            {/* Row 4 */}
            <span className="self-center" />
            <span className="text-sm font-semibold text-gray-400 self-center">11/12</span>
            <span className="text-lg font-semibold text-black cursor-pointer px-1 py-1 hover:bg-yellow-100 hover:underline underline-offset-2 decoration-yellow-600">
              How results accumulate, the secret to motivation, and living with calm persistence
            </span>
          </div>
        </div>

        {/* 2024 */}
        <div className="mt-12">
          <div className="grid grid-cols-[70px_70px_minmax(0,1fr)] gap-x-10 gap-y-3 text-sm">
            {/* Row 1 */}
            <span className="text-xl font-bold text-black self-start">2024</span>
            <span className="text-sm font-semibold text-gray-400 self-center">20/11</span>
            <span className="text-lg font-semibold text-black cursor-pointer px-1 py-1 hover:bg-yellow-100 hover:underline underline-offset-2 decoration-yellow-600">
              A holiday feast to remember
            </span>

            {/* Row 2 */}
            <span className="self-center" />
            <span className="text-sm font-semibold text-gray-400 self-center">06/11</span>
            <span className="text-lg font-semibold text-black cursor-pointer px-1 py-1 hover:bg-yellow-100 hover:underline underline-offset-2 decoration-yellow-600">
              Fermentation and flavor science
            </span>

            {/* Row 3 */}
            <span className="self-center" />
            <span className="text-sm font-semibold text-gray-400 self-center">23/10</span>
            <span className="text-lg font-semibold text-black cursor-pointer px-1 py-1 hover:bg-yellow-100 hover:underline underline-offset-2 decoration-yellow-600">
              Building flavor from scratch
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}