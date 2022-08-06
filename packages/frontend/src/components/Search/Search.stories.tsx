import { ComponentMeta,ComponentStory } from "@storybook/react";
import React from "react";

import { Search as Component } from "./Search";

export default {
  title: "Components/Search",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Search = Template.bind({});
