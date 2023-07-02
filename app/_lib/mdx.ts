import { bundleMDX } from "mdx-bundler";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import readingTime from "reading-time";
import getAllFilesRecursively from "./utils/files";
import dynamic from "next/dynamic";
import { PostFrontMatter } from "../_types/PostFrontMatter";
import { AuthorFrontMatter } from "../_types/AuthorFrontMatter";
import { Toc } from "../_types/Toc";
// Remark packages
import remarkGfm from "remark-gfm";
import remarkFootnotes from "remark-footnotes";
import remarkMath from "remark-math";
import remarkExtractFrontmatter from "./remark-extract-frontmatter";
import remarkCodeTitles from "./remark-code-title";
import remarkTocHeadings from "./remark-toc-headings";
import remarkImgToJsx from "./remark-img-to-jsx";
import { BuildOptions } from "esbuild";
// Rehype packages
const rehypeCitation: any = dynamic(() => import("rehype-citation") as any);
const rehypeSlug: any = dynamic(() => import("rehype-slug") as any);
const rehypeAutolinkHeadings: any = dynamic(
  () => import("rehype-autolink-headings") as any
);
const rehypePrismPlus: any = dynamic(() => import("rehype-prism-plus") as any);
const rehypeKatex: any = dynamic(() => import("rehype-katex") as any);
const rehypePresetMinify: any = dynamic(
  () => import("rehype-preset-minify") as any
);

const root = process.cwd();

export function getFiles(type: "blog" | "authors") {
  const prefixPaths = path.join(root, "/app/_data", type);
  const files = getAllFilesRecursively(prefixPaths);
  // Only want to return blog/path and ignore root, replace is needed to work on Windows
  return files.map((file) =>
    file.slice(prefixPaths.length + 1).replace(/\\/g, "/")
  );
}

export function formatSlug(slug: string) {
  return slug.replace(/\.(mdx|md)/, "");
}

export function dateSortDesc(a: string, b: string) {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
}

export async function getFileBySlug<T>(
  type: "authors" | "blog",
  slug: string | string[]
) {
  const mdxPath = path.join(root, "/app/_data", type, `${slug}.mdx`);
  const mdPath = path.join(root, "/app/_data", type, `${slug}.md`);
  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, "utf8")
    : fs.readFileSync(mdPath, "utf8");
  // https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
  if (process.platform === "win32") {
    process.env.ESBUILD_BINARY_PATH = path.join(
      root,
      "node_modules",
      "esbuild",
      "esbuild.exe"
    );
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      root,
      "node_modules",
      "esbuild",
      "bin",
      "esbuild"
    );
  }

  let toc: Toc = [];

  const { code, frontmatter } = await bundleMDX({
    source,
    // mdx imports can be automatically source from the components directory
    cwd: path.join(root, "components"),
    mdxOptions(options) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkExtractFrontmatter,
        [remarkTocHeadings, { exportRef: toc }],
        remarkGfm,
        remarkCodeTitles,
        [remarkFootnotes, { inlineNotes: true }],
        remarkMath,
        remarkImgToJsx,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [rehypeCitation, { path: path.join(root, "_data") }],
        [rehypePrismPlus, { ignoreMissing: true }],
        rehypePresetMinify,
      ];
      return options;
    },
    esbuildOptions: (options: BuildOptions) => {
      options.loader = {
        ...options.loader,
        ".ts": "tsx",
      };
      return options;
    },
  });

  return {
    mdxSource: code,
    toc,
    frontMatter: {
      readingTime: readingTime(code),
      slug: slug || null,
      fileName: fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      ...frontmatter,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
    },
  };
}

export async function getAllFilesFrontMatter(folder: "blog") {
  const prefixPaths = path.join(root, "/app/_data", folder);
  const files = getAllFilesRecursively(prefixPaths);

  const allFrontMatter: PostFrontMatter[] = [];

  files.forEach((file) => {
    // Replace is needed to work on Windows
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, "/");
    // Remove Unexpected File
    if (path.extname(fileName) !== ".md" && path.extname(fileName) !== ".mdx") {
      return;
    }
    const source = fs.readFileSync(file, "utf8");
    const matterFile = matter(source);
    const frontmatter = matterFile.data as AuthorFrontMatter | PostFrontMatter;
    if ("draft" in frontmatter && frontmatter.draft !== true) {
      allFrontMatter.push({
        ...frontmatter,
        slug: formatSlug(fileName),
        date: frontmatter.date ? new Date(frontmatter.date).toISOString() : "",
      });
    }
  });

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date));
}
