import React from "react";
import { Container, Typography, makeStyles } from "@material-ui/core";
import { DiscussionEmbed } from "disqus-react";
import { NextSeo } from "next-seo";
import { MDXRemote } from "next-mdx-remote";
import components from "../../features/mdx-components";
import ShareButtons from "../../features/share-buttons";
import ArticleLayout from "../../layouts/article-layout";
import ArticleSchema from "../../features/content-schemas/article-schema";
import { getSlugs } from "../../utils/file-browsers";
import { getContentBySlug } from "../../utils/queries";
import YoutubeEmbed from "../../features/youtube-embed";
import {StickyShareButtons} from 'sharethis-reactjs';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    padding: 0,
    minHeight: theme.spacing(6),
  },
  hero: {
    backgroundSize: "cover",
    display: "flex",
    minHeight: theme.spacing(75),
    color: theme.palette.common.white,
  },
  heroFilter: {
    flexGrow: 1,
    backdropFilter: "brightness(0.35)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  article: {
    marginBottom: "100px",
  },
}));

export default function Article({ mdxSource, frontMatter }) {
  const classes = useStyles();
  const { tags, videoId, title, thumbnail, id, excerpt, path, url } = frontMatter;
  const videos = videoId ? [{ url: `https://youtu.be/${videoId}` }] : null;
  return (
    <>
      <NextSeo
        title={title}
        titleTemplate=" %s | Hanami Mastery - a knowledge base to hanami framework"
        twitter={{
          site: "@hanamimastery",
          handle: "@sebwilgosz",
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[{
          name: 'twitter:image',
          content: thumbnail.big,
        }]}
        canonical={url}
        description={excerpt}
        openGraph={{
          article: {
            authors: ["https://www.facebook.com/sebastian.wilgosz"],
            tags,
          },
          locale: "en_US",
          url,
          title,
          description: excerpt,
          defaultImageWidth: 120,
          defaultImageHeight: 630,
          type: "article",
          site_name: "Hanami Mastery - a knowledge base to hanami framework",
          videos: videos,
          images: [
            {
              url: thumbnail.big,
              width: 780,
              height: 440,
              alt: title,
            }
          ],
        }}
        facebook={{
          appId: process.env.NEXT_PUBLIC_FB_APP_ID,
        }}
      />
      <section
        className={classes.hero}
        style={{ backgroundImage: `url("${thumbnail.full}")` }}
      >
        <Typography variant="h4" align="center" className={classes.heroFilter}>
          {title}
        </Typography>
      </section>
      <ArticleSchema article={frontMatter} />
      <ArticleLayout
        article={
          <Container maxWidth="lg" component="main">
            <ShareButtons />
            <article className={classes.article}>
              <MDXRemote {...mdxSource} components={components} />
            </article>
            <div>
              <DiscussionEmbed
                shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME}
                config={{
                  url: `${url}`,
                  title,
                  identifier: `article-${id}`,
                }}
              />
            </div>
          </Container>
        }
      />
    </>
  );
}

export async function getStaticPaths() {
  const slugs = await getSlugs("articles");

  return {
    paths: slugs.map((p) => ({ params: { slug: p } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getContentBySlug("articles", params.slug);
  return { props: { ...post } };
}
