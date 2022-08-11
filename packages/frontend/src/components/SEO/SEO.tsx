import NextHead from "next/head";
import React from "react";

import { SERVICE_BASE_URL, SERVICE_DESCRIPTION, SERVICE_NAME } from "../../lib/app/constants";

export const SEO: React.FC = () => {
  return (
    <NextHead>
      <title>{SERVICE_NAME}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <meta property="og:url" content={SERVICE_BASE_URL} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={SERVICE_NAME} />
      <meta property="og:site_name" content={SERVICE_NAME} />
      <meta property="og:description" content={SERVICE_DESCRIPTION} />
      <meta property="og:image" content={`${SERVICE_BASE_URL}/docs/key-visual.png`} />
      <meta name="twitter:card" content={"summary_large_image"} />
    </NextHead>
  );
};
