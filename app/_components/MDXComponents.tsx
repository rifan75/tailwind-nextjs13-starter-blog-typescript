/* eslint-disable react/display-name */
"use client";
import { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import Image from "./Image";
import CustomLink from "./Link";
import TOCInline from "./TOCInline";
import Pre from "./Pre";
import { BlogNewsletterForm } from "./NewsletterForm";

type MDXComponents = import("mdx/types").MDXComponents;

export const MDXComponents: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  wrapper: ({ layout, ...rest }: { layout: string }) => {
    const Layout = require(`../_layouts/${layout}`).default;
    return <Layout {...rest} />;
  },
  BlogNewsletterForm: BlogNewsletterForm,
};

interface Iprops {
  layout: string;
  mdxSource: string;
  [key: string]: unknown;
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }: Iprops) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);

  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />;
};
