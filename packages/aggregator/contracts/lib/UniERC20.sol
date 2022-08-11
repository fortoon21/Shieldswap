// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {SafeMath} from "./SafeMath.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

library UniERC20 {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 private constant _ETH_ADDRESS_ = IERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    function universalApproveMax(
        IERC20 token,
        address to,
        uint256 amount
    ) internal {
        uint256 allowance = token.allowance(address(this), to);
        if (allowance < amount) {
            token.safeApprove(to, type(uint256).max);
        }
    }

    function isETH(IERC20 token) internal pure returns (bool) {
        return (token == _ETH_ADDRESS_);
    }

    function uniBalanceOf(IERC20 token, address account) internal view returns (uint256) {
        if (isETH(token)) {
            return account.balance;
        } else {
            return token.balanceOf(account);
        }
    }

    function uniTransfer(
        IERC20 token,
        address to,
        uint256 amount
    ) internal {
        if (amount > 0) {
            if (isETH(token)) {
                (bool sent, ) = payable(to).call{value: amount}("");
                require(sent, "Failed_To_Transfer_ETH");
            } else {
                token.safeTransfer(to, amount);
            }
        }
    }
}
