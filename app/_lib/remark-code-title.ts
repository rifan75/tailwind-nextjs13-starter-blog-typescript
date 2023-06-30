import dynamic from "next/dynamic";

const visit: any = dynamic(() => import("unist-util-visit") as any, {
  ssr: false,
});

import { Node } from "unist";

interface ItitleNode {
  type: string;
  name: string;
  attributes: {
    type: string;
    name: string;
    value: string;
  }[];
  children: {
    type: string;
    value: string;
  }[];
  data: {
    _xdmExplicitJsx: boolean;
  };
}
export default function remarkCodeTitles() {
  return (tree: Node) =>
    visit(
      tree,
      "code",
      (node: { lang: string }, index: number, parent: { children: Node[] }) => {
        const nodeLang = node.lang || "";
        let language = "";
        let title = "";

        if (nodeLang.includes(":")) {
          language = nodeLang.slice(0, nodeLang.search(":"));
          title = nodeLang.slice(nodeLang.search(":") + 1, nodeLang.length);
        }

        if (!title) {
          return;
        }

        const className = "remark-code-title";

        const titleNode: ItitleNode = {
          type: "mdxJsxFlowElement",
          name: "div",
          attributes: [
            { type: "mdxJsxAttribute", name: "className", value: className },
          ],
          children: [{ type: "text", value: title }],
          data: { _xdmExplicitJsx: true },
        };

        parent.children.splice(index, 0, titleNode);

        node.lang = language;
      }
    );
}
