import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import sanityClient, { urlFor } from '../../Sanity';
import { GetStaticProps } from 'next';
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Post as PostType } from '../../typing';

interface Props {
    post: PostType;
}

type Inputs = {
    id: string;
    name: string;
    email: string;
    comment: string;
};

const Post = ({ post }: Props) => {
    const [submitted, setSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await fetch('/api/createComment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                setSubmitted(false);
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            setSubmitted(false);
        }
    };

    return (
        <div>
            <Header />
            <img
                className="w-full h-96 object-cover mx-auto"
                src={urlFor(post.mainImage).url()}
                alt="cover"
            />
            <div className="max-w-3xl mx-auto mb-10">
                <article className="w-full mx-auto p-5 bg-white">
                    <h1 className="font-titleFont font-medium text-[32px] text-primary border-b-[1px] border-b-cyan-800 mt-10 mb-3 text-center">
                        {post.title}
                    </h1>
                    <h2 className="font-bodyFont text-[18px] text-gray-500 mb-2 text-center">
                        {post.description}
                    </h2>
                    <div className="flex items-center gap-2 justify-center mt-4">
    <img
        className="rounded-full w-12 h-12 object-cover"
        src={urlFor(post.author.image).url()}
        alt="authorImg"
    />
    <p className="font-bodyFont text-base text-gray-700">
        Blog Post By <span className="font-bold">{post.author.name}</span> - Published on{' '}
        {new Date(post.publishedAt).toLocaleDateString()}
    </p>
</div>

                    <div className="mt-10">
                        <PortableText
                            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}
                            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 's5wlo7s0'}
                            content={post.body}
                            serializers={{
                                h1: (props: any) => <h1 className="text-3xl font-bold my-5 font-titleFont mx-auto text-center" {...props} />,
                                h2: (props: any) => <h2 className="text-2xl font-bold my-5 font-titleFont mx-auto text-center" {...props} />,
                                li: ({ children }: any) => <li className="ml-4 list-disc text-center">{children}</li>,
                                link: ({ href, children }: any) => (
                                    <a href={href} className="text-cyan-500 hover:underline mx-auto text-center">
                                        {children}
                                    </a>
                                ),
                                img: (props: any) => (
                                    <img
                                        {...props}
                                        className="w-full max-w-[500px] h-auto mx-auto my-4 object-contain"
                                    />
                                ),
                            }}
                        />
                    </div>
                </article>
                <hr className="max-w-lg my-5 mx-auto border[1px] border-black" />
                <div>
                    <p className="text-xs text-black uppercase font-titleFont font-bold text-center">
                        Enjoyed This Article?
                    </p>
                    <h3 className="font-titleFont text-3xl font-bold text-center">Leave a Comment Below!</h3>
                    <hr className="py-3 mt-2" />
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-6">
                        <input {...register('id')} type="hidden" value={post._id} />
                        <label className="flex flex-col">
                            <span className="font-titleFont font-semibold text-base">Name</span>
                            <input
                                {...register('name', { required: true })}
                                className="text-base placeholder:text-sm border-b-[1px] border-black py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                                type="text"
                                placeholder="Enter your Name"
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="font-titleFont font-semibold text-base">Email</span>
                            <input
                                {...register('email', { required: true })}
                                className="text-base placeholder:text-sm border-b-[1px] border-black py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                                type="email"
                                placeholder="Enter your Email"
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="font-titleFont font-semibold text-base">Comment</span>
                            <textarea
                                {...register('comment', { required: true })}
                                className="text-base placeholder:text-sm border-b-[1px] border-black py-1 px-4 outline-none focus-within:shadow-xl shadow-black"
                                placeholder="Enter your Comments"
                                rows={6}
                            />
                        </label>
                        <button
                            className="w-full bg-black text-white text-base font-titleFont font-semibold tracking-wider uppercase py-2 rounded-sm hover:bg-black duration-300"
                            type="submit"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Post;

export const getStaticPaths = async () => {
    const query = `
    *[_type == "post"]{
        _id,
        slug {
            current
        }
    }`;

    const posts = await sanityClient.fetch(query);
    const paths = posts.map((post: PostType) => ({
        params: { slug: post.slug.current },
    }));

    return {
        paths,
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `
    *[_type == "post" && slug.current == $slug][0]{
        _id,
        publishedAt,
        title,
        author -> {
            name,
            image
        },
        description,
        mainImage,
        slug,
        body
    }`;

    const post = await sanityClient.fetch(query, {
        slug: params?.slug as string,
    });

    if (!post) {
        return {
            notFound: true,
        };
    }

    return {
        props: { post },
        revalidate: 60,
    };
};
