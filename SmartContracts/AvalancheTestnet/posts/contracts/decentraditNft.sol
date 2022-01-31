// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";

contract Decentradit is ERC721 {
    constructor() ERC721("TaurusCollectiveNet", "TCN") {} //Call ERC function from Openzeppelin and give name and simbol

    event PostCreated(
        bytes32 indexed postId,
        address indexed postOwner,
        bytes32 indexed parentId,
        bytes32 contentId,
        bytes32 categoryId
    );
    event CommentCreated(
        bytes32 indexed postId,
        address indexed postOwner,
        bytes32 indexed parentId,
        bytes32 contentId,
        bytes32 categoryId
    );
    event ContentAdded(bytes32 indexed contentId, string contentUri);
    event CategoryCreated(bytes32 indexed categoryId, string category);
    event Voted(
        bytes32 indexed postId,
        address indexed postOwner,
        address indexed voter,
        uint80 reputationPostOwner,
        uint80 reputationVoter,
        int40 postVotes,
        bool up,
        uint8 reputationAmount
    );

    struct post {
        address postOwner;
        bytes32 parentPost;
        bytes32 contentId;
        int40 votes;
        bytes32 categoryId;
        bytes32[] commentList; // list of comment keys so we can look them up
    }

    struct comment {
        address postOwner;
        bytes32 parentPost;
        bytes32 contentId;
        int40 votes;
        bytes32 categoryId;
    }

    bytes32[] public posts; //just for testing

    mapping(address => mapping(bytes32 => uint80)) reputationRegistry;
    mapping(bytes32 => string) categoryRegistry;
    mapping(bytes32 => string) contentRegistry;
    mapping(bytes32 => post) postRegistry;
    mapping(bytes32 => comment) commentRegistry;
    mapping(address => mapping(bytes32 => bool)) voteRegistry;

    function createPost(
        bytes32 _parentId,
        string calldata _contentUri,
        bytes32 _categoryId
    ) external {
        address _owner = msg.sender;
        bytes32 _contentId = keccak256(abi.encode(_contentUri));
        bytes32 _postId = keccak256(
            abi.encodePacked(_owner, _parentId, _contentId)
        );

        _safeMint(msg.sender, uint256(_postId));

        contentRegistry[_contentId] = _contentUri;
        postRegistry[_postId].postOwner = _owner;
        postRegistry[_postId].parentPost = _parentId;
        postRegistry[_postId].contentId = _contentId;
        postRegistry[_postId].categoryId = _categoryId;

        posts.push(_postId); //just for testing

        emit ContentAdded(_contentId, _contentUri);
        emit PostCreated(_postId, _owner, _parentId, _contentId, _categoryId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        //overriding Openzeppeline function, because our structure of URI wont have an incrimental path that is relevant to the token Id.
        //return Items[tokenId].uri;  //returns uri of a token
        bytes32 thisContentId = postRegistry[bytes32(tokenId)].contentId;
        return contentRegistry[thisContentId];
    }

    function createComment(
        bytes32 _parentId,
        string calldata _contentUri,
        bytes32 _categoryId
    ) external {
        address _owner = msg.sender;
        bytes32 _contentId = keccak256(abi.encode(_contentUri));
        bytes32 _postId = keccak256(
            abi.encodePacked(_owner, _parentId, _contentId)
        );
        contentRegistry[_contentId] = _contentUri;

        postRegistry[_parentId].commentList.push(_postId);

        commentRegistry[_postId].postOwner = _owner;
        commentRegistry[_postId].parentPost = _parentId;
        commentRegistry[_postId].contentId = _contentId;
        commentRegistry[_postId].categoryId = _categoryId;
        emit ContentAdded(_contentId, _contentUri);
        emit CommentCreated(
            _postId,
            _owner,
            _parentId,
            _contentId,
            _categoryId
        );
    }

    function voteUp(bytes32 _postId, uint8 _reputationAdded) external {
        address _voter = msg.sender;
        bytes32 _category = postRegistry[_postId].categoryId;
        address _contributor = postRegistry[_postId].postOwner;
        require(
            postRegistry[_postId].postOwner != _voter,
            "you cannot vote your own posts"
        );
        require(
            voteRegistry[_voter][_postId] == false,
            "Sender already voted in this post"
        );
        require(
            validateReputationChange(_voter, _category, _reputationAdded) ==
                true,
            "This address cannot add this amount of reputation points"
        );
        postRegistry[_postId].votes += 1;
        reputationRegistry[_contributor][_category] += _reputationAdded;
        voteRegistry[_voter][_postId] = true;
        emit Voted(
            _postId,
            _contributor,
            _voter,
            reputationRegistry[_contributor][_category],
            reputationRegistry[_voter][_category],
            postRegistry[_postId].votes,
            true,
            _reputationAdded
        );
    }

    function voteDown(bytes32 _postId, uint8 _reputationTaken) external {
        address _voter = msg.sender;
        bytes32 _category = postRegistry[_postId].categoryId;
        address _contributor = postRegistry[_postId].postOwner;
        // require(
        //     voteRegistry[_voter][_postId] == false,
        //     "Sender already voted in this post"
        // );   //if sender has voted than he can unvode (like -> unlike)
        require(
            voteRegistry[_voter][_postId] == true,
            "Sender hasn't voted in this post yet"
        );
        require(
            validateReputationChange(_voter, _category, _reputationTaken) ==
                true,
            "This address cannot take this amount of reputation points"
        );
        postRegistry[_postId].votes >= 1
            ? postRegistry[_postId].votes -= 1
            : postRegistry[_postId].votes = 0;
        reputationRegistry[_contributor][_category] >= _reputationTaken
            ? reputationRegistry[_contributor][_category] -= _reputationTaken
            : reputationRegistry[_contributor][_category] = 0;
        // voteRegistry[_voter][_postId] = true;
        voteRegistry[_voter][_postId] = false; //enable so he can vote again
        emit Voted(
            _postId,
            _contributor,
            _voter,
            reputationRegistry[_contributor][_category],
            reputationRegistry[_voter][_category],
            postRegistry[_postId].votes,
            false,
            _reputationTaken
        );
    }

    function validateReputationChange(
        address _sender,
        bytes32 _categoryId,
        uint8 _reputationAdded
    ) internal view returns (bool _result) {
        uint80 _reputation = reputationRegistry[_sender][_categoryId];
        if (_reputation < 2) {
            _reputationAdded == 1 ? _result = true : _result = false;
        } else {
            2**_reputationAdded <= _reputation
                ? _result = true
                : _result = false;
        }
    }

    function addCategory(string calldata _category) external {
        bytes32 _categoryId = keccak256(abi.encode(_category));
        categoryRegistry[_categoryId] = _category;
        emit CategoryCreated(_categoryId, _category);
    }

    function getContent(bytes32 _contentId)
        public
        view
        returns (string memory)
    {
        return contentRegistry[_contentId];
    }

    function getCategory(bytes32 _categoryId)
        public
        view
        returns (string memory)
    {
        return categoryRegistry[_categoryId];
    }

    function getReputation(address _address, bytes32 _categoryID)
        public
        view
        returns (uint80)
    {
        return reputationRegistry[_address][_categoryID];
    }

    function getPost(bytes32 _postId)
        public
        view
        returns (
            address,
            bytes32,
            bytes32,
            int72,
            bytes32,
            bytes32[] memory
        )
    {
        return (
            postRegistry[_postId].postOwner,
            postRegistry[_postId].parentPost,
            postRegistry[_postId].contentId,
            postRegistry[_postId].votes,
            postRegistry[_postId].categoryId,
            postRegistry[_postId].commentList
        );
    }

    function getComment(bytes32 _postId)
        public
        view
        returns (
            address,
            bytes32,
            bytes32,
            int72,
            bytes32
        )
    {
        return (
            commentRegistry[_postId].postOwner,
            commentRegistry[_postId].parentPost,
            commentRegistry[_postId].contentId,
            commentRegistry[_postId].votes,
            commentRegistry[_postId].categoryId
        );
    }

    function getPosts() public view returns (bytes32[] memory) {
        //just for testing
        return posts;
    }
}
