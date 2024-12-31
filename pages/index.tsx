import Head from "next/head";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import sanityClient, { urlFor } from '../sanity';
import { Post } from "../typing";
import Link from "next/link";

interface Props {
  posts: Post[];
}

export default function Home({ posts }: Props) {
  return (
    <div>
      <Head>
        <title>CryptoBlog</title>
        <link rel="icon" href="/smallLogo.ico" />
      </Head>

      {/* Navbar */}
      <Header />

     {/* Hero Section */}
<main className="font-bodyFont">
<div className="bg-gray-900 text-white py-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 className="text-4xl font-bold">
      Explore the Future of Cryptocurrency
    </h1>
    <p className="mt-2 text-lg">
      Stay informed with the latest blockchain trends, market insights, and crypto analytics.
    </p>
  </div>
</div>

        {/* Featured Posts */}
        <div className="max-w-7xl mx-auto py-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8">
          {posts.map((post, index) => (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div
                className={`group border rounded-md overflow-hidden shadow-lg ${
                  index === 0 ? "col-span-2 lg:col-span-3" : ""
                }`}
              >
                <div className="relative">
                  {post.mainImage && (
                    <Image
                      width={400}
                      height={300}
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      className="w-full h-[300px] sm:h-[400px] object-cover brightness-75 group-hover:brightness-100 transition duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent group-hover:bg-black/40 transition duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <p className="text-sm mt-1">{post.description.substring(0, 50)}...</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    author -> {
      name,
      image
    },
    description,
    mainImage,
    slug
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
