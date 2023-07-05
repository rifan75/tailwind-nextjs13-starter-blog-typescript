import { PageSEO } from "../../../_components/SEO";
import siteMetadata from "../../../_data/siteMetadata";
import { getAllFilesFrontMatter } from "../../../_lib/mdx";
import ListLayout from "../../../_layouts/ListLayout";
import { POSTS_PER_PAGE } from "../../page";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const posts = await getAllFilesFrontMatter("blog");
  const pageNumber = parseInt(params.slug);
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  );
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };
  return (
    <>
      <PageSEO
        title={siteMetadata.title}
        description={siteMetadata.description}
      />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  );
}
