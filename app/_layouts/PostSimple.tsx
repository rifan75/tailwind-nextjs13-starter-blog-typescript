import { ReactNode } from "react";
import Link from "../_components/Link";
import PageTitle from "../_components/PageTitle";
import SectionContainer from "../_components/SectionContainer";
import { BlogSEO } from "../_components/SEO";
import siteMetadata from "../_data/siteMetadata";
import formatDate from "../_lib/utils/formatDate";
import Comments from "../_components/comments";
import ScrollTopAndComment from "../_components/ScrollTopAndComment";
import { PostFrontMatter } from "../_types/PostFrontMatter";

interface Iprops {
  frontMatter: PostFrontMatter;
  children: ReactNode;
  next?: { slug: string; title: string };
  prev?: { slug: string; title: string };
}

export default function PostLayout({
  frontMatter,
  next,
  prev,
  children,
}: Iprops) {
  const { date, title } = frontMatter;

  return (
    <SectionContainer>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/blog/${frontMatter.slug}`}
        {...frontMatter}
      />
      <ScrollTopAndComment />
      <article>
        <div>
          <header>
            <div className="space-y-1 border-b border-gray-200 pb-10 text-center dark:border-gray-700">
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {formatDate(date as unknown as Date)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0 "
            style={{ gridTemplateRows: "auto 1fr" }}
          >
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pt-10 pb-8 dark:prose-dark">
                {children}
              </div>
            </div>
            <Comments frontMatter={frontMatter} />
            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/blog/${prev.slug}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/blog/${next.slug}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  );
}