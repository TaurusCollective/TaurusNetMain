// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Decentrausers {
    event UserCreated(
        bytes32 indexed userId,
        address indexed ethAddress,
        bytes32 contentId
    );

    event ContentAdded(bytes32 indexed contentId, string contentUri);

    struct user {
        address ethAddress;
        bytes32 contentId;
    }

    bytes32[] public users;

    mapping(bytes32 => user) userRegistry;
    mapping(bytes32 => string) contentRegistry;

    function createUser(
        //create or update
        //lahko naredis tak da shranis podatke na ipfs pa jih pol tu zapises tak ko je createPost preko _contentUri, al pa tak:
        string calldata _contentUri
    ) external {
        address _owner = msg.sender;
        bytes32 _contentId = keccak256(abi.encode(_contentUri));
        bytes32 _userId = keccak256(abi.encodePacked(_owner));

        if (_owner == userRegistry[_userId].ethAddress) {
            contentRegistry[_contentId] = _contentUri;
            userRegistry[_userId].contentId = _contentId;

            emit ContentAdded(_contentId, _contentUri);
            emit UserCreated(_userId, _owner, _contentId);
        } else {
            contentRegistry[_contentId] = _contentUri;
            userRegistry[_userId].ethAddress = _owner;
            userRegistry[_userId].contentId = _contentId;

            users.push(_userId); //just for testing

            emit ContentAdded(_contentId, _contentUri);
            //emit PostCreated(_userId, _owner, _parentId, _contentId, _categoryId);
            emit UserCreated(_userId, _owner, _contentId);
        }
    }

    function testEncode(string calldata _contentUri)
        external
        pure
        returns (bytes32)
    {
        bytes32 _contentId = keccak256(abi.encode(_contentUri));
        return _contentId;
    }

    function getUser(bytes32 _userId) public view returns (address, bytes32) {
        return (
            userRegistry[_userId].ethAddress,
            userRegistry[_userId].contentId
        );
    }

    function getContent(bytes32 _contentId)
        public
        view
        returns (string memory)
    {
        return contentRegistry[_contentId];
    }

    function getUsers() public view returns (bytes32[] memory) {
        //just for testing
        return users;
    }
}
