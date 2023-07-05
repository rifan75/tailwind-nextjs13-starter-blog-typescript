import { getAllFilesFrontMatter } from "../_lib/mdx";
import siteMetadata from "../_data/siteMetadata";
import ListLayout from "../_layouts/ListLayout";
import { PageSEO } from "../_components/SEO";

export const POSTS_PER_PAGE = 5;

export default async function Blog() {
  const posts = await getAllFilesFrontMatter("blog");
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE);
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };
  return (
    <>
      <PageSEO
        title={`Blog - ${siteMetadata.author}`}
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
