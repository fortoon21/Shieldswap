import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { Modal as Component } from "./Modal";

export default {
  title: "Components/Modal",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Modal = Template.bind({});
