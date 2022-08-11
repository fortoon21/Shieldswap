// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import {IApprove} from "../intf/IApprove.sol";
import {InitializableOwnable} from "../lib/InitializableOwnable.sol";

interface IApproveProxy {
    function isAllowedProxy(address _proxy) external view returns (bool);

    function claimTokens(
        address token,
        address from,
        address to,
        uint256 amount
    ) external;
}

/**
 * @title ApproveProxy
 * @author DODO Breeder
 *
 * @notice Allow different version dodoproxy to claim from Approve
 */
contract ApproveProxy is InitializableOwnable {
    // ============ Storage ============
    mapping(address => bool) public _IS_ALLOWED_PROXY_;
    address public _PENDING_ADD_PROXY_;
    address public immutable _APPROVE_;

    constructor(address dodoApporve) {
        _APPROVE_ = dodoApporve;
    }

    function init(address owner, address[] memory proxies) external {
        initOwner(owner);
        for (uint256 i = 0; i < proxies.length; i++) _IS_ALLOWED_PROXY_[proxies[i]] = true;
    }

    function unlockAddProxy(address newProxy) public onlyOwner {
        _PENDING_ADD_PROXY_ = newProxy;
    }

    function lockAddProxy() public onlyOwner {
        _PENDING_ADD_PROXY_ = address(0);
    }

    function addDODOProxy() external onlyOwner {
        _IS_ALLOWED_PROXY_[_PENDING_ADD_PROXY_] = true;
        lockAddProxy();
    }

    function removeDODOProxy(address oldDodoProxy) public onlyOwner {
        _IS_ALLOWED_PROXY_[oldDodoProxy] = false;
    }

    function claimTokens(
        address token,
        address from,
        address to,
        uint256 amount
    ) external {
        require(_IS_ALLOWED_PROXY_[msg.sender], "ApproveProxy:Access restricted");
        IApprove(_APPROVE_).claimTokens(token, from, to, amount);
    }

    function isAllowedProxy(address _proxy) external view returns (bool) {
        return _IS_ALLOWED_PROXY_[_proxy];
    }
}
