import React, { useState } from "react";
import siteMetadata from "../../_data/siteMetadata";
import { PostFrontMatter } from "../../_types/PostFrontMatter";

interface Iprops {
  frontMatter: PostFrontMatter;
}

const Disqus = ({ frontMatter }: Iprops) => {
  const [enableLoadComments, setEnabledLoadComments] = useState<boolean>(true);

  const COMMENTS_ID = "disqus_thread";

  function LoadComments() {
    setEnabledLoadComments(false);

    (window as any).disqus_config = function () {
      this.page.url = window.location.href;
      this.page.identifier = frontMatter.slug;
    };
    if ((window as any).DISQUS === undefined) {
      const script = document.createElement("script");
      script.src =
        "https://" +
        siteMetadata.comment.disqusConfig.shortname +
        ".disqus.com/embed.js";
      script.setAttribute("data-timestamp", String(+new Date()));
      script.setAttribute("crossorigin", "anonymous");
      script.async = true;
      document.body.appendChild(script);
    } else {
      (window as any).DISQUS.reset({ reload: true });
    }
  }

  return (
    <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300">
      {enableLoadComments && (
        <button onClick={LoadComments}>Load Comments</button>
      )}
      <div className="disqus-frame" id={COMMENTS_ID} />
    </div>
  );
};

export default Disqus;
