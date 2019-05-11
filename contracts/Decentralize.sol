pragma solidity ^0.5.0;

contract Decentralize {
  uint projectId = 1;

  mapping(uint => bytes32) projectIdToName;
  mapping(uint => address) projectIdToOwner;
  mapping(uint => bytes32) projectIdToIPFSHash;
  mapping(uint => bytes32[]) projectIdToCommits;

  mapping(uint => mapping(address => bool)) projectPermissions; // projectId => (userAddress => bool) ...does user have permission?

  event Commit(uint indexed _projectId, address _user, bytes32 _message);

  modifier onlyOwner(uint _projectId){
    require(projectIdToOwner[_projectId] == msg.sender, "Sorry, only project owner can send invitations.");
    _;
  }

  modifier onlyPermissionedUsers(uint _projectId){
    require(projectPermissions[_projectId][msg.sender] == true, "Sorry, only permissioned users can submit code");
    _;
  }

  function createProject(bytes32 _name) public {
    projectIdToName[projectId] = _name;
    projectPermissions[projectId][msg.sender] = true;
    projectIdToOwner[projectId++] = msg.sender;
  }

  function inviteTeammate(uint _projectId, address _teammate) public onlyOwner(_projectId){
    projectPermissions[_projectId][_teammate] = true;
  }

  // updates projectId => IPFShash pointer
  function submitCode(uint _projectId, bytes32 _newHash, bytes32 _commitMessage) public onlyPermissionedUsers(_projectId){
    projectIdToIPFSHash[_projectId] = _newHash;
    emit Commit(_projectId, msg.sender, _commitMessage);
  }
  


}
