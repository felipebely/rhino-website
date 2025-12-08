import { useEffect, useState, Fragment } from "react";
import { sanity } from "../../lib/sanity";
import { PortableText } from "@portabletext/react";
import { urlFor } from "../../lib/imageBuilder";
import { Link, useParams } from "react-router-dom";

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

const postBySlugQuery = `
  *[_type == "newsletterPost" && slug.current == $slug][0] {
    title,
    author,
    date,
    content
  }
`;

export function Newsletter() {
  const [post, setPost] = useState<NewsletterPost | null>(null);
  const [allPosts, setAllPosts] = useState<NewsletterPostWithMeta[]>([]);
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      sanity.fetch<NewsletterPost>(postBySlugQuery, { slug }).then(setPost);
    } else {
      sanity.fetch<NewsletterPost>(latestPostQuery).then(setPost);
    }
  }, [slug]);

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
    <main className="bg-white min-h-screen px-6 py-16 max-w-4xl mx-auto font-['Times_New_Roman',serif]">
      {/* Post Header */}
      <section className="mb-16 text-left">

        {post ? (
          <>
            <h1 className="text-4xl font-bold mb-3">{post.title}</h1>

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
            <h1 className="text-5xl font-bold mb-3">Loading…</h1>
            <p className="text-gray-700 text-xl">Please wait</p>
          </>
        )}
      </section>

      {/* Post Body */}
      <section className="prose prose-xl text-xl text-gray-800 leading-relaxed mb-24 font-['Times_New_Roman',serif]">
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
        <h2 className="text-4xl font-bold mb-3 text-center">All Newsletters</h2>
        <p className="text-center text-gray-700 text-lg mb-10">
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
                  
                  <span className="text-2xl font-bold text-black self-start">{year}</span>
  
                  {posts
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((p, index) => (
                      <Fragment key={p._id}>
                        {index !== 0 && <span className="self-center" />}
  
                        <span className="text-md font-semibold text-gray-500 self-center">
                          {new Date(p.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </span>
  
                        <Link
                          to={`/newsletter/${p.slug.current}`}
                          className="text-xl font-semibold text-black cursor-pointer px-1 py-1 hover:bg-yellow-100 hover:underline underline-offset-2 decoration-yellow-600 inline font-['Times_New_Roman',serif]"
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