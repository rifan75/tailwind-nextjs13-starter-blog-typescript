import { MDXLayoutRenderer } from "../_components/MDXComponents";
import { getFileBySlug } from "../_lib/mdx";
import { AuthorFrontMatter } from "../_types/AuthorFrontMatter";

const DEFAULT_LAYOUT = "AuthorLayout";

interface IAuthorProps {
  mdxSource: string;
  frontMatter: AuthorFrontMatter;
}

export default async function About() {
  const authorDetails = await getFileBySlug<AuthorFrontMatter>("authors", [
    "default",
  ]);

  const { mdxSource, frontMatter } = authorDetails as unknown as IAuthorProps;

  if (!mdxSource || !frontMatter) {
    // Handle the case where mdxSource or frontMatter is undefined
    return null;
  }
  
  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout || DEFAULT_LAYOUT}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  );
}
