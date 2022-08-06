import NextHead from "next/head";
import React from "react";

import { SERVICE_NAME } from "../../lib/constants";

export const SEO: React.FC = () => {
  return (
    <NextHead>
      <title>{SERVICE_NAME}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      {/* <meta property="og:url" content="" /> */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={SERVICE_NAME} />
      <meta property="og:site_name" content={SERVICE_NAME} />
      {/* <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content={type} /> */}
    </NextHead>
  );
};
