"use client";
import "../_css/tailwind.css";
import "../_css/prism.css";
import "katex/dist/katex.css";

import "@fontsource/inter/latin.css";

import { ThemeProvider } from "next-themes";
import Head from "next/head";

import siteMetadata from "../_data/siteMetadata";
import Analytics from "./analytics";
import LayoutWrapper from "./LayoutWrapper";
import { ClientReload } from "./ClientReload";

const isDevelopment = process.env.NODE_ENV === "development";
const isSocket = process.env.SOCKET;

export default function Provider({
  children,
}: {
  children: React.ReactElement;
}) {
  console.log("Provider", children);
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics />
      <LayoutWrapper>{children}</LayoutWrapper>
      {/* {children} */}
    </ThemeProvider>
  );
}
