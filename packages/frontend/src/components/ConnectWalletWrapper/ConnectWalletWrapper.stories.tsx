import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { ConnectWalletWrapper as Component } from "./ConnectWalletWrapper";

export default {
  title: "Components/Connect Wallet Wrapper",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const ConnectWalletWrapper = Template.bind({});
