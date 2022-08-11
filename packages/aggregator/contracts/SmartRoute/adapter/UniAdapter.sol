// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.15;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IRouterAdapter} from "../intf/IRouterAdapter.sol";
import {IUni} from "../intf/IUni.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeMath} from "../../lib/SafeMath.sol";

contract UniAdapter is IRouterAdapter {
  using SafeMath for uint256;

  constructor(address[] memory factories, address[] memory wMatics) {
    _changeWMatic(factories, wMatics);
  }

  function factory(address pool) public override returns (address) {
    return IUni(pool).factory();
  }

  function getAmountOut(
    address fromToken,
    uint256 amountIn,
    address toToken,
    address pool
  ) public view override returns (uint256 _output) {
    require(amountIn > 0, "UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT");

    (uint256 reserve0, uint256 reserve1, ) = IUni(pool).getReserves();
    require(reserve0 > 0 && reserve1 > 0, "UniswapV2Library: INSUFFICIENT_LIQUIDITY");

    uint256 reserveInput;
    uint256 reserveOutput;
    address token0 = IUni(pool).token0();
    if (fromToken == token0) {
      (reserveInput, reserveOutput) = (reserve0, reserve1);
    } else if (toToken == token0) {
      (reserveInput, reserveOutput) = (reserve1, reserve0);
    } else {
      revert("Not valid from-to token pair");
    }

    uint256 amountInWithFee = amountIn.mul(997);
    uint256 numerator = amountInWithFee.mul(reserveOutput);
    uint256 denominator = reserveInput.mul(1000).add(amountInWithFee);
    _output = numerator / denominator;
  }

  function swapExactIn(
    address fromToken,
    uint256 amountIn,
    address toToken,
    address pool,
    address to
  ) external override returns (uint256 _output) {
    _output = getAmountOut(fromToken, amountIn, toToken, pool);
    (uint256 amount0Out, uint256 amount1Out) = fromToken == IUni(pool).token0()
      ? (uint256(0), _output)
      : (_output, uint256(0));
    IUni(pool).swap(amount0Out, amount1Out, to, new bytes(0));
  }
}
