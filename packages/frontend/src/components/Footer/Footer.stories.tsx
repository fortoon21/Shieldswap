import { ComponentMeta,ComponentStory } from "@storybook/react";
import React from "react";

import { Footer as Component } from "./Footer";

export default {
  title: "Components/Footer",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Footer = Template.bind({});
