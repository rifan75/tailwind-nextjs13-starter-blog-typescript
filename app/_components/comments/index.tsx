import siteMetadata from "../../_data/siteMetadata";
import dynamic from "next/dynamic";
import { PostFrontMatter } from "../../_types/PostFrontMatter";

const UtterancesComponent = dynamic(
  () => {
    return import("../../_components/comments/Utterances");
  },
  { ssr: false }
);
const GiscusComponent = dynamic(
  () => {
    return import("../../_components/comments/Giscus");
  },
  { ssr: false }
);
const DisqusComponent = dynamic(
  () => {
    return import("../../_components/comments/Disqus");
  },
  { ssr: false }
);

const Comments = ({ frontMatter }: { frontMatter: PostFrontMatter }) => {
  const comment = siteMetadata?.comment;
  if (!comment || Object.keys(comment).length === 0) return <></>;
  return (
    <div id="comment">
      {siteMetadata.comment && siteMetadata.comment.provider === "giscus" && (
        <GiscusComponent />
      )}
      {siteMetadata.comment &&
        siteMetadata.comment.provider === "utterances" && (
          <UtterancesComponent />
        )}
      {siteMetadata.comment && siteMetadata.comment.provider === "disqus" && (
        <DisqusComponent frontMatter={frontMatter} />
      )}
    </div>
  );
};

export default Comments;
