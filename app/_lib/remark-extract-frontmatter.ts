import dynamic from "next/dynamic";
import { load } from "js-yaml";
import { Node } from "unist";
import { VFile } from "vfile";

const visit: any = dynamic(() => import("unist-util-visit") as any, {
  ssr: false,
});

export default function extractFrontmatter() {
  return (tree: Node, file: VFile) => {
    visit(
      tree,
      "yaml",
      (node: { value: string }, index: number, parent: Node) => {
        file.data.frontmatter = load(node.value);
      }
    );
  };
}
