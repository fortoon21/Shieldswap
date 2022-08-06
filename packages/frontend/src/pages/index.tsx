import type { NextPage } from "next";

import { Layout } from "../components/Layout";
import { SEO } from "../components/SEO";
import { Swap } from "../components/Swap";

const Home: NextPage = () => {
  return (
    <Layout>
      <SEO />
      <Swap />
    </Layout>
  );
};

export default Home;
