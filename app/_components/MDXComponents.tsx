/* eslint-disable react/display-name */
"use client";
import { ReactNode, useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import Image from "./Image";
import CustomLink from "./Link";
import TOCInline from "./TOCInline";
import Pre from "./Pre";
import { BlogNewsletterForm } from "./NewsletterForm";

type MDXComponentsType = import("mdx/types").MDXComponents;

export const MDXComponents: MDXComponentsType = {
  //code
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm: BlogNewsletterForm,
  wrapper: ({
    layout,
    ...rest
  }: {
    layout: string;
  }) => {
    const Layout = require(`../_layouts/${layout}`).default;
    return <Layout {...rest} />;
  },
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
