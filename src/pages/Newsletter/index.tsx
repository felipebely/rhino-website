import { useEffect, useState, Fragment } from "react";
import { sanity } from "../../lib/sanity";
import { PortableText } from "@portabletext/react";
import { urlFor } from "../../lib/imageBuilder";
import { Link } from "react-router-dom";

type NewsletterPost = {
  title: string;
  author: string;
  date: string;
  content: any[];
};

type NewsletterPostWithMeta = NewsletterPost & {
  _id: string;
  slug: { current: string };
};

const latestPostQuery = `
  *[_type == "newsletterPost"] | order(date desc)[0] {
    title,
    author,
    date,
    content
  }
`;

export function Newsletter() {
  const [post, setPost] = useState<NewsletterPost | null>(null);
  const [allPosts, setAllPosts] = useState<NewsletterPostWithMeta[]>([]);

  useEffect(() => {
    sanity.fetch<NewsletterPost>(latestPostQuery).then(setPost);
  }, []);

  useEffect(() => {
    sanity
      .fetch<NewsletterPostWithMeta[]>(
        `*[_type == "newsletterPost"] | order(date desc) {
          _id,
          title,
          author,
          date,
          slug
        }`
      )
      .then(setAllPosts);
  }, []);

  return (
    <main className="bg-white min-h-screen px-6 py-16 max-w-4xl mx-auto font-work-sans">
      {/* Post Header */}
      <section className="mb-16 text-left">

        {post ? (
          <>
            <h1 className="text-4xl font-bold mb-2">{post.title}</h1>

            <p className="text-gray-700 text-lg">
              {post.author}
            </p>

            <p className="text-gray-500 text-md">
              {new Date(post.date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </>
        ) : (
          <>
            {/* Fallback while loading */}
            <h1 className="text-4xl font-bold mb-2">Loading…</h1>
            <p className="text-gray-700 text-lg">Please wait</p>
          </>
        )}
      </section>

      {/* Post Body */}
      <section className="prose prose-lg text-gray-800 leading-relaxed mb-24">
        {post ? (
          <PortableText
            value={post.content}
            components={{
              types: {
                image: ({ value }) => (
                  <img
                    src={urlFor(value).width(900).quality(90).url()}
                    alt={value.alt || "Newsletter image"}
                    className="rounded-lg my-8 w-full"
                  />
                ),
              },
            }}
          />
        ) : (
          <p>Loading content…</p>
        )}
      </section>

      {/* All Newsletters */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-2 text-center">All Newsletters</h2>
        <p className="text-center text-gray-600 mb-10">
          Read past issues of the Rhino Newsletter.
        </p>

        {allPosts.length > 0 && (() => {
          const groupedByYear = allPosts.reduce<Record<string, NewsletterPostWithMeta[]>>(
            (groups, post) => {
              const year = new Date(post.date).getFullYear().toString();
              if (!groups[year]) groups[year] = [];
              groups[year].push(post);
              return groups;
            },
            {}
          );
  
          return Object.entries(groupedByYear)
            .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)) // newest year first
            .map(([year, posts]) => (
              <div key={year} className="mt-12">
                <div className="grid grid-cols-[70px_70px_minmax(0,1fr)] gap-x-10 gap-y-3 text-sm">
                  
                  <span className="text-xl font-bold text-black self-start">{year}</span>
  
                  {posts
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((p, index) => (
                      <Fragment key={p._id}>
                        {index !== 0 && <span className="self-center" />}
  
                        <span className="text-sm font-semibold text-gray-400 self-center">
                          {new Date(p.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </span>
  
                        <Link
                          to={`/newsletter/${p.slug.current}`}
                          className="text-lg font-semibold text-black cursor-pointer px-1 py-1 hover:bg-yellow-100 hover:underline underline-offset-2 decoration-yellow-600 inline"
                        >
                          {p.title}
                        </Link>
                      </Fragment>
                    ))}
                </div>
              </div>
            ));
        })()}
      </section>
    </main>
  );
}