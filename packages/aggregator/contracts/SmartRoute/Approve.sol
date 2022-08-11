// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {InitializableOwnable} from "../lib/InitializableOwnable.sol";

contract Approve is InitializableOwnable {
  using SafeERC20 for IERC20;

  // ============ Storage ============
  address public _PENDING_PROXY_;
  address public _PROXY_;

  // ============ Events ============

  event SetProxy(address indexed oldProxy, address indexed newProxy);

  function init(address owner, address initProxyAddress) external {
    initOwner(owner);
    _PROXY_ = initProxyAddress;
  }

  function unlockSetProxy(address newProxy) public onlyOwner {
    _PENDING_PROXY_ = newProxy;
  }

  function lockSetProxy() public onlyOwner {
    _PENDING_PROXY_ = address(0);
  }

  function setProxy() external onlyOwner {
    emit SetProxy(_PROXY_, _PENDING_PROXY_);
    _PROXY_ = _PENDING_PROXY_;
    lockSetProxy();
  }

  function claimTokens(
    address token,
    address from,
    address to,
    uint256 amount
  ) external {
    require(msg.sender == _PROXY_, "Approve:Access restricted");
    if (amount > 0) {
      IERC20(token).safeTransferFrom(from, to, amount);
    }
  }

  function getProxy() public view returns (address) {
    return _PROXY_;
  }
}
