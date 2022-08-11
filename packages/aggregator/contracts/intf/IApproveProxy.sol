// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.15;

interface IApproveProxy {
    function isAllowedProxy(address _proxy) external view returns (bool);

    function claimTokens(
        address token,
        address from,
        address to,
        uint256 amount
    ) external;
}
