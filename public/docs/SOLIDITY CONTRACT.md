// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.20;

/\*═══════════════════════════════════════════  
   I M P O R T S  
  ═══════════════════════════════════════════\*/

// Thirdweb base contract (ERC721A, Ownable, Royalty, etc.)  
import "https://raw.githubusercontent.com/thirdweb-dev/contracts/main/contracts/base/ERC721Base.sol";

// OpenZeppelin ReentrancyGuard (no Context import – safe)  
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/utils/ReentrancyGuard.sol";

// Thirdweb's Address library (no Context import)  
import "https://raw.githubusercontent.com/thirdweb-dev/contracts/main/contracts/lib/Address.sol";

/\*═══════════════════════════════════════════  
   C O N T R A C T  
  ═══════════════════════════════════════════\*/

contract GenesisSoul is ERC721Base, ReentrancyGuard {  
    using Address for address payable;

    /\*═══════════════════════════════════════════  
       C O N S T A N T S  
      ═══════════════════════════════════════════\*/

    uint256 public constant PRIMARY\_FOUNDER\_SHARE\_BP \= 3000; // 30%  
    uint256 public constant PRIMARY\_USER\_SHARE\_BP   \= 7000; // 70%

    uint96  public constant SECONDARY\_ROYALTY\_TOTAL\_BP \= 700;  
    uint256 public constant SECONDARY\_MINER\_SPLIT\_BP   \= 5000; // (kept as reference; off‑chain split)

    /\*═══════════════════════════════════════════  
       S T A T E   V A R I A B L E S  
      ═══════════════════════════════════════════\*/

    uint256 public founderClaimable;  
    mapping(uint256 \=\> string) private \_tokenURIs;

    address public immutable founder;  
    address public immutable engineWallet;   // receives 7% secondary royalties directly  
    address public minter;                   // single minter address (backend wallet)

    /\*═══════════════════════════════════════════  
       C U S T O M   P A U S A B L E  
      ═══════════════════════════════════════════\*/

    bool private \_paused;

    modifier whenNotPaused() {  
        require(\!\_paused, "Pausable: paused");  
        \_;  
    }

    function \_pause() internal { \_paused \= true; }  
    function \_unpause() internal { \_paused \= false; }

    /\*═══════════════════════════════════════════  
       C O N S T R U C T O R  
      ═══════════════════════════════════════════\*/

    constructor(  
        string memory \_name,  
        string memory \_symbol,  
        address \_founder,  
        address \_defaultAdmin,  
        address \_engineWallet  
    )  
        ERC721Base(  
            \_defaultAdmin,      // owner (deployer)  
            \_name,  
            \_symbol,  
            \_engineWallet,      // royalty receiver  
            700                 // 7% royalty  
        )  
        payable  
    {  
        require(\_founder \!= address(0), "Founder zero");  
        require(\_defaultAdmin \!= address(0), "Admin zero");  
        require(\_engineWallet \!= address(0), "Engine zero");

        founder \= \_founder;  
        engineWallet \= \_engineWallet;  
        minter \= \_defaultAdmin;     // deployer initially can mint; transfer later  
    }

    /\*═══════════════════════════════════════════  
       M I N T E R   M A N A G E M E N T  
      ═══════════════════════════════════════════\*/

    modifier onlyMinter() {  
        require(msg.sender \== minter, "Not minter");  
        \_;  
    }

    /// @notice Owner‑only function to set the official minter address.  
    function setMinter(address \_minter) external onlyOwner {  
        require(\_minter \!= address(0), "Zero address");  
        minter \= \_minter;  
    }

    /\*═══════════════════════════════════════════  
       P R I M A R Y   M I N T   (70/30 SPLIT)  
      ═══════════════════════════════════════════\*/

    function mintWithSplit(  
        address to,  
        string memory uri  
    )  
        external  
        payable  
        onlyMinter  
        whenNotPaused  
        nonReentrant  
    {  
        require(to \!= address(0), "Mint to zero address");  
        require(msg.value \> 0, "Primary mint requires ETH payment");

        uint256 userShare    \= (msg.value \* PRIMARY\_USER\_SHARE\_BP) / 10000;  
        uint256 founderShare \= msg.value \- userShare;  
        founderClaimable \+= founderShare;

        \_safeMint(to, 1);  
        uint256 tokenId \= \_nextTokenId() \- 1;  
        \_setTokenURI(tokenId, uri);

        payable(to).sendValue(userShare);

        emit PrimaryMint(tokenId, to, msg.value, userShare, founderShare);  
    }

    event PrimaryMint(  
        uint256 indexed tokenId,  
        address indexed minter,  
        uint256 totalValue,  
        uint256 userShare,  
        uint256 founderShare  
    );

    /\*═══════════════════════════════════════════  
       F O U N D E R   W I T H D R A W A L  
      ═══════════════════════════════════════════\*/

    function claimFounder() external onlyOwner {  
        uint256 amount \= founderClaimable;  
        require(amount \> 0, "No primary funds");  
        founderClaimable \= 0;  
        payable(founder).sendValue(amount);  
    }

    /\*═══════════════════════════════════════════  
       B U R N   ( P H A S E   2 )  
      ═══════════════════════════════════════════\*/

    function burn(uint256 tokenId) external override whenNotPaused {  
        require(isApprovedOrOwner(msg.sender, tokenId), "Not owner or approved");  
        \_burn(tokenId);  
        delete \_tokenURIs\[tokenId\];  
        emit SoulBurned(tokenId, msg.sender);  
    }

    event SoulBurned(uint256 indexed tokenId, address indexed burner);

    /\*═══════════════════════════════════════════  
       M U T A B L E   T O K E N   U R I  
      ═══════════════════════════════════════════\*/

    function setTokenURI(uint256 tokenId, string memory newURI) external onlyOwner {  
        require(\_exists(tokenId), "Token does not exist");  
        \_setTokenURI(tokenId, newURI);  
        emit MetadataUpdated(tokenId, newURI);  
    }

    event MetadataUpdated(uint256 indexed tokenId, string newURI);

    /\*═══════════════════════════════════════════  
       P A U S A B L E   H O O K  
      ═══════════════════════════════════════════\*/

    function \_beforeTokenTransfers(  
        address from,  
        address to,  
        uint256 startTokenId,  
        uint256 quantity  
    )  
        internal  
        override  
        whenNotPaused  
    {  
        super.\_beforeTokenTransfers(from, to, startTokenId, quantity);  
    }

    /\*═══════════════════════════════════════════  
       I N T E R N A L   H E L P E R S  
      ═══════════════════════════════════════════\*/

    function \_setTokenURI(uint256 tokenId, string memory \_tokenURI) internal override {  
        require(\_exists(tokenId), "URI set for nonexistent token");  
        \_tokenURIs\[tokenId\] \= \_tokenURI;  
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {  
        require(\_exists(tokenId), "URI query for nonexistent token");  
        return \_tokenURIs\[tokenId\];  
    }

    function \_nextTokenId() internal view returns (uint256) {  
        return \_currentIndex;  
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {  
        return super.supportsInterface(interfaceId);  
    }

    /\*═══════════════════════════════════════════  
       A D M I N   T O G G L E S  
      ═══════════════════════════════════════════\*/

    function pause() external onlyOwner {  
        \_pause();  
    }

    function unpause() external onlyOwner {  
        \_unpause();  
    }  
}  
