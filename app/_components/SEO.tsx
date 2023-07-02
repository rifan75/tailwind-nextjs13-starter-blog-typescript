"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";
import siteMetadata from "../_data/siteMetadata";
import { PostFrontMatter } from "../_types/PostFrontMatter";
import { AuthorFrontMatter } from "../_types/AuthorFrontMatter";

interface CommonSEOProps {
  title: string;
  description: string | undefined;
  ogType: string;
  ogImage:
    | string
    | {
        "@type": string;
        url: string;
      }[];
  twImage: string;
  canonicalUrl?: string;
}

interface ISEOProps {
  title: string;
  description: string;
}

interface IBlogSEOProps extends PostFrontMatter {
  authorDetails?: AuthorFrontMatter[];
  url: string;
}

const CommonSEO = ({
  title,
  description,
  ogType,
  ogImage,
  twImage,
  canonicalUrl,
}: CommonSEOProps) => {
  const pathname = usePathname();
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta property="og:url" content={`${siteMetadata.siteUrl}${pathname}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteMetadata.title} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      {Array.isArray(ogImage) ? (
        ogImage.map(({ url }: { url: string }) => (
          <meta property="og:image" content={url} key={url} />
        ))
      ) : (
        <meta property="og:image" content={ogImage} key={ogImage} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteMetadata.twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twImage} />
      <link
        rel="canonical"
        href={
          canonicalUrl ? canonicalUrl : `${siteMetadata.siteUrl}${pathname}`
        }
      />
    </Head>
  );
};

export const PageSEO = ({ title, description }: ISEOProps) => {
  const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
  const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
  return (
    <CommonSEO
      title={title}
      description={description}
      ogType="website"
      ogImage={ogImageUrl}
      twImage={twImageUrl}
    />
  );
};

export const TagSEO = ({ title, description }: ISEOProps) => {
  const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
  const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
  const pathname = usePathname();
  return (
    <>
      <CommonSEO
        title={title}
        description={description}
        ogType="website"
        ogImage={ogImageUrl}
        twImage={twImageUrl}
      />
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${description} - RSS feed`}
          href={`${siteMetadata.siteUrl}${pathname}/feed.xml`}
        />
      </Head>
    </>
  );
};

export const BlogSEO = ({
  authorDetails,
  title,
  summary,
  date,
  lastmod,
  url,
  images = [],
  canonicalUrl,
}: IBlogSEOProps) => {
  const publishedAt = new Date(date).toISOString();
  const modifiedAt = new Date(lastmod || date).toISOString();
  let imagesArr =
    images.length === 0
      ? [siteMetadata.socialBanner]
      : typeof images === "string"
      ? [images]
      : images;

  const featuredImages = imagesArr.map((img) => {
    return {
      "@type": "ImageObject",
      url: img.includes("http") ? img : siteMetadata.siteUrl + img,
    };
  });

  let authorList;
  if (authorDetails) {
    authorList = authorDetails.map((author) => {
      return {
        "@type": "Person",
        name: author.name,
      };
    });
  } else {
    authorList = {
      "@type": "Person",
      name: siteMetadata.author,
    };
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: title,
    image: featuredImages,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: authorList,
    publisher: {
      "@type": "Organization",
      name: siteMetadata.author,
      logo: {
        "@type": "ImageObject",
        url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
      },
    },
    description: summary,
  };

  const twImageUrl = featuredImages[0].url;

  return (
    <>
      <CommonSEO
        title={title}
        description={summary}
        ogType="article"
        ogImage={featuredImages}
        twImage={twImageUrl}
        canonicalUrl={canonicalUrl}
      />
      <Head>
        {date && (
          <meta property="article:published_time" content={publishedAt} />
        )}
        {lastmod && (
          <meta property="article:modified_time" content={modifiedAt} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      </Head>
    </>
  );
};
