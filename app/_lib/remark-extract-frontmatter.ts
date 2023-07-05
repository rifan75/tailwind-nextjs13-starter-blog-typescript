import dynamic from "next/dynamic";
import { load } from "js-yaml";
import { Node } from "unist";
import { VFile } from "vfile";
import {visit} from 'unist-util-visit'

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
