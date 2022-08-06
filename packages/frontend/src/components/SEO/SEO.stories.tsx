import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { SEO as Component } from "./SEO";

export default {
  title: "Components/SEO",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SEO = Template.bind({});
