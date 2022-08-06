import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { SearchBox as Component } from "./SearchBox";

export default {
  title: "Components/Search Box",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SearchBox = Template.bind({});
