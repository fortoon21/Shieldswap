// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/interfaces/IERC20Metadata.sol";
import "../interfaces/ITokenInfoViewer.sol";

/*
 * @dev: for test only
 */
import "hardhat/console.sol";

contract TokenViewer is ITokenInfoViewer {
  function tokenInfo(address token) public view virtual override returns (TokenInfo memory) {
    TokenInfo memory tokenInfo;

    /*
     * @dev: some token in the pair does not support thouse metadata fetch, so it is included in try catch statement
     */
    try this.getTokenMetadata(token) returns (uint8 decimals, string memory name, string memory symbol) {
      tokenInfo = TokenInfo(token, decimals, name, symbol);
    } catch {}
    return tokenInfo;
  }

  function getTokenMetadata(address token)
    public
    view
    returns (
      uint8,
      string memory,
      string memory
    )
  {
    uint8 decimals = IERC20Metadata(token).decimals();
    string memory name = IERC20Metadata(token).name();
    string memory symbol = IERC20Metadata(token).name();
    return (decimals, name, symbol);
  }
}
