import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { Layout as Component } from "./Layout";

export default {
  title: "Components/Layout",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Layout = Template.bind({});

Layout.args = {
  children: "Internal component goes here",
};
