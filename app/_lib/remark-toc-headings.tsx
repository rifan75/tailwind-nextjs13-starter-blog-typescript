import { slug } from "github-slugger";
import { toString } from "mdast-util-to-string";
import { Node } from "unist";
import {visit} from 'unist-util-visit'

interface ExportRef {
  value: string;
  url: string;
  depth: number;
}

interface Options {
  exportRef: ExportRef[];
}

export default function remarkTocHeadings(options: Options) {
  return (tree: Node) =>
    visit(
      tree,
      "heading",
      (node: { depth: number }, index: number, parent: Node) => {
        const textContent = toString(node);
        options.exportRef.push({
          value: textContent,
          url: "#" + slug(textContent),
          depth: node.depth,
        });
      }
    );
}
