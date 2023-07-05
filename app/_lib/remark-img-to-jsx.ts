import dynamic from "next/dynamic";
import sizeOf from "image-size";
import fs from "fs";
import { Node } from "unist";
import {visit} from 'unist-util-visit'

interface ImageNode extends Node {
  attributes: (
    | { type: string; name: string; value: string }
    | { type: string; name: string; value: number | undefined }
  )[];
  name: string;
  url: string;
  alt: string;
}

interface ParentNode extends Node {
  children?: Node[];
}

export default function remarkImgToJsx() {
  return (tree: Node) => {
    visit(
      tree,
      // only visit p tags that contain an img element
      (node: ParentNode) =>
        node.type === "paragraph" &&
        node.children?.some((n) => n.type === "image"),
      (node: ParentNode) => {
        const imageNode = node.children?.find((n) => n.type === "image") as
          | ImageNode
          | undefined;

        // only local files
        if (
          imageNode &&
          fs.existsSync(`${process.cwd()}/public${imageNode?.url}`)
        ) {
          const dimensions = sizeOf(`${process.cwd()}/public${imageNode?.url}`);

          // Convert original node to next/image
          (imageNode.type = "mdxJsxFlowElement"),
            (imageNode.name = "Image"),
            (imageNode.attributes = [
              { type: "mdxJsxAttribute", name: "alt", value: imageNode.alt },
              { type: "mdxJsxAttribute", name: "src", value: imageNode.url },
              {
                type: "mdxJsxAttribute",
                name: "width",
                value: dimensions.width,
              },
              {
                type: "mdxJsxAttribute",
                name: "height",
                value: dimensions.height,
              },
            ]);

          // Change node type from p to div to avoid nesting error
          node.type = "div";
          node.children = [imageNode];
        }
      }
    );
  };
}
