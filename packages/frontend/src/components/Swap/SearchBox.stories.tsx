import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { Swap as Component } from "./SearchBox";

export default {
  title: "Components/Swap",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Swap = Template.bind({});
