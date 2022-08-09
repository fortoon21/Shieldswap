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
        TokenInfo memory tokenInfo = TokenInfo(
            token,
            IERC20Metadata(token).decimals(),
            IERC20Metadata(token).name(),
            IERC20Metadata(token).symbol()
        );
        return tokenInfo;
    }
}
