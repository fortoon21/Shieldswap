import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Swap as Component } from "./Swap";

export default {
  title: "Components/Swap",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Swap = Template.bind({});
