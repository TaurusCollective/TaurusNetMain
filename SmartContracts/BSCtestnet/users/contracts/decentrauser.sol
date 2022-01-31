// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Decentrausers {
    event UserCreated(
        bytes32 indexed userId,
        address indexed ethAddress,
        bytes32 username,
        bytes32 avatar,
        uint80 reputationOverall,
        bytes32[] postList
    );

    event UserUpdated(
        bytes32 indexed userId,
        address indexed ethAddress,
        bytes32 username,
        bytes32 avatar,
        uint80 reputationOverall,
        bytes32[] postList
    );

    struct user {
        address ethAddress;
        bytes32 username;
        bytes32 avatar; //put this on ipfs
        uint80 reputationOverall;
        bytes32[] postList; // list of posts keys so we can look them up
        //bytes32[] commentList; // list of posts keys so we can look them up, če hočem to met. V clud function po comments dodaj tako kod je pod posts.
    }

    bytes32[] public users;

    mapping(bytes32 => user) userRegistry;

    function createUser(
        //lahko naredis tak da shranis podatke na ipfs pa jih pol tu zapises tak ko je createPost preko _contentUri, al pa tak:
        bytes32 _username,
        bytes32 _avatar,
        uint80 _reputationOverall,
        bytes32[] memory _postList
    ) external {
        address _owner = msg.sender;
        //bytes32 _contentId = keccak256(abi.encode(_contentUri));
        bytes32 _userId = keccak256(
            abi.encodePacked(_owner, _username, _avatar)
        );
        //contentRegistry[_contentId] = _contentUri;
        userRegistry[_userId].ethAddress = _owner;
        userRegistry[_userId].username = _username;
        userRegistry[_userId].avatar = _avatar;
        userRegistry[_userId].reputationOverall = _reputationOverall;
        userRegistry[_userId].postList = _postList;

        users.push(_userId); //just for testing

        //emit ContentAdded(_contentId, _contentUri);
        //emit PostCreated(_userId, _owner, _parentId, _contentId, _categoryId);
        emit UserCreated(
            _userId,
            _owner,
            _username,
            _avatar,
            _reputationOverall,
            _postList
        );
    }

    function updateUser(
        //lahko naredis tak da shranis podatke na ipfs pa jih pol tu zapises tak ko je createPost preko _contentUri, al pa tak:
        bytes32 _userId,
        bytes32 _username,
        bytes32 _avatar,
        uint80 _reputationOverall,
        bytes32[] memory _postList
    ) external {
        address _owner = msg.sender;
        require(
            _owner == userRegistry[_userId].ethAddress,
            "You are not the originaluser!"
        );
        // //bytes32 _contentId = keccak256(abi.encode(_contentUri));
        // bytes32 _userId = keccak256(
        //     abi.encodePacked(_owner, username, avatar)
        // );
        //contentRegistry[_contentId] = _contentUri;
        userRegistry[_userId].username = _username;
        userRegistry[_userId].avatar = _avatar;
        userRegistry[_userId].reputationOverall = _reputationOverall;
        userRegistry[_userId].postList = _postList;

        //emit ContentAdded(_contentId, _contentUri);
        //emit PostCreated(_userId, _owner, _parentId, _contentId, _categoryId);
        emit UserUpdated(
            _userId,
            _owner,
            _username,
            _avatar,
            _reputationOverall,
            _postList
        );
    }

    function getPost(bytes32 _userId)
        public
        view
        returns (
            address,
            bytes32,
            bytes32,
            uint80,
            bytes32[] memory
        )
    {
        return (
            userRegistry[_userId].ethAddress,
            userRegistry[_userId].username,
            userRegistry[_userId].avatar,
            userRegistry[_userId].reputationOverall,
            userRegistry[_userId].postList
        );
    }
}
