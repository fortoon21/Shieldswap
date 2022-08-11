// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface Routing {
    function getAmountOut(
        address fromToken,
        uint256 amountIn,
        address toToken,
        address pool
    ) external view returns (uint256 _output);

    function swapExactIn(
        address fromToken,
        uint256 amountIn,
        address toToken,
        address pool,
        address to
    ) external returns (uint256 _output);

    function factory(address pool) external returns (address);
}

abstract contract IRouterAdapter is ReentrancyGuard, Routing, Ownable {
    event setWMATIC(address wMatic);
    event unsetWMATIC(address wMatic);
    event changeWMATIC(address factory, address wMatic);
    mapping(address => uint8) public isMatic;
    mapping(address => address) public factoryToWMatic;

    function checkWMatic(address token) public view returns (bool) {
        return isMatic[token] == 1;
    }

    function getWMatic(address factory) public view returns (address) {
        return factoryToWMatic[factory];
    }

    function changeWMatic(address[] memory factories, address[] memory wMatics) public onlyOwner {
        _changeWMatic(factories, wMatics);
    }

    function _setWMatic(address wMatic) internal {
        if (isMatic[wMatic] == 0) {
            isMatic[wMatic] = 1;
            emit setWMATIC(wMatic);
        }
    }

    function _unsetWMatic(address wMatic) internal {
        if (isMatic[wMatic] == 1) {
            isMatic[wMatic] = 0;
            emit unsetWMATIC(wMatic);
        }
    }

    function _changeWMatic(address[] memory factories, address[] memory wMatics) internal {
        for (uint256 i; i < wMatics.length; i++) {
            if (wMatics[i] == address(0)) {
                _unsetWMatic(wMatics[i]);
            } else {
                _setWMatic(wMatics[i]);
            }
            factoryToWMatic[factories[i]] = wMatics[i];
            emit changeWMATIC(factories[i], wMatics[i]);
        }
    }
}
