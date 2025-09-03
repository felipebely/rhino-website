export function Contato() {
  return (
    <main className="bg-white min-h-auto">
      <section className="mx-auto px-6 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4 text-gray-900"
            style={{ fontFamily: "Work Sans, sans-serif" }}
          >
            Entre em Contato
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aqui para ajudar! Entre em contato conosco através das
            nossas redes sociais ou envie uma mensagem.
          </p>
        </div>

        {/* Social Media Links */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Instagram */}
          <div className="bg-black rounded-2xl p-8 text-white text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Instagram</h3>
            <p className="mb-4 text-gray-300">
              Siga-nos para novidades e inspirações
            </p>
            <a
              href="https://www.instagram.com/orhinocozinha"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              @orhinocozinha
            </a>
          </div>

          {/* WhatsApp */}
          <div className="bg-black rounded-2xl p-8 text-white text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">WhatsApp</h3>
            <p className="mb-4 text-gray-300">Fale conosco diretamente</p>
            <a
              href={`https://wa.me/5551991632950?text=${encodeURIComponent(
                "Oi, Rhino! 🦏 Gostaria de saber mais sobre os serviços de eventos, e experiências que vocês realizam…"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Enviar Mensagem
            </a>
          </div>
        </div>

        {/* Contact Form */}
        {/* <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Envie uma Mensagem
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-300"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-300"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Assunto
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-300"
                placeholder="Qual o assunto da sua mensagem?"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-300 resize-none"
                placeholder="Conte-nos como podemos ajudar..."
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Enviar Mensagem
              </button>
            </div>
          </form>
        </div> */}

        {/* Additional Info */}
        {/* <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Ou entre em contato por email:</p>
          <a
            href="mailto:contato@rhino.com"
            className="text-black hover:text-gray-700 font-semibold text-lg transition-colors duration-300"
          >
            contato@rhino.com
          </a>
        </div> */}
      </section>
    </main>
  );
}
