pragma solidity ^0.5.0;

contract Decentralize {
  uint projectId = 1;

  mapping(uint => bytes32) projectIdToName;
  mapping(uint => address) projectIdToOwner;
  mapping(uint => bytes32) projectIdToIPFSHash;
  mapping(uint => bytes32[]) projectIdToCommits;

  mapping(uint => address[]) projectIdToUsers;
  mapping(uint => mapping(address => bool)) projectPermissions; // projectId => (userAddress => bool) ...does user have permission?

  mapping(address => uint[]) userIdToProjects;

  event ProjectCreated(address indexed _creator, uint _projectId, bytes32 _name);
  event UserInvited(address indexed _invitee, address _inviter, uint _projectId);
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
    projectIdToUsers[projectId].push(msg.sender);
    projectIdToOwner[projectId] = msg.sender;

    userIdToProjects[msg.sender].push(projectId);

    emit ProjectCreated(msg.sender, projectId++, _name);
  }

  function inviteTeammate(uint _projectId, address _teammate) public onlyOwner(_projectId){
    projectPermissions[_projectId][_teammate] = true;
    projectIdToUsers[_projectId].push(_teammate);

    userIdToProjects[_teammate].push(projectId);
    
    emit UserInvited(_teammate, msg.sender, _projectId);
  }

  // updates projectId => IPFShash pointer
  function submitCode(uint _projectId, bytes32 _newHash, bytes32 _commitMessage) public onlyPermissionedUsers(_projectId){
    projectIdToIPFSHash[_projectId] = _newHash;
    projectIdToCommits[_projectId].push(_commitMessage);

    emit Commit(_projectId, msg.sender, _commitMessage);
  }

  // Getter functions
  function getUsersByProjectId(uint _projectId) public view returns(address[] memory userIds) {
    return projectIdToUsers[_projectId];
  }

  function getNameByProjectId(uint _projectId) public view returns(bytes32) {
    return projectIdToName[_projectId];
  }

  function getCommitsByProjectId(uint _projectId) public view returns(bytes32[] memory commits) {
    return projectIdToCommits[_projectId];
  }

  function getProjectsByUserId(address _user) public view returns(uint[] memory projectIds){
    return userIdToProjects[_user];
  }

}
