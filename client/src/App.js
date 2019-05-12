import React, { Component } from "react";
import CodeHeroContract from "./contracts/Decentralize.json";
import {
  Container,
  Label, 
  FormGroup, 
  Navbar, 
  Card,

} from 'reactstrap'
import getWeb3 from "./utils/getWeb3";

// Components
import ProjectData from './components/ProjectInfo';

import "./App.css";

class App extends Component {
  constructor(props){
    super(props);
    this.state = { 
      web3: null, 
      accounts: null, 
      contract: null,
      projectSelected: null,
      projectIdSelected: null,
      CodeHeroAddress: "0x2aD97B528791d6d165e9CF2D5ba85F685Bb11E1c" 
    };
    this.onClickSelected = this.onClickSelected.bind(this)

  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Rinkeby testnet
      const CodeHeroAddress = this.state.CodeHeroAddress;

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const instance = new web3.eth.Contract(
        CodeHeroContract.abi,
        CodeHeroAddress,
      );


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getContractFeeds);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getContractFeeds = async () => {
    const { accounts, contract, web3 } = this.state;  
    // Just so user address has data, until we assign this to eth.accounts[0] 
    const hardcodedUserAddress = "0xcC4c3FBfA2716D74B3ED6514ca8Ba99d7f941dF9"
    const hardcodedProjectId = "1";
    let currentProjectId = null;

    

    const userProjectIds = await contract.methods.getProjectsByUserId(hardcodedUserAddress).call();
    const userProjectNames = [];
    userProjectIds.forEach(async(id) => {
      let name = await contract.methods.getNameByProjectId(id).call();
      name = web3.utils.toAscii(name);
      userProjectNames.push(name);
    })

   

    if(this.state.projectSelected == null){
      this.setState({
        projectSelected: userProjectNames[0],
        projectIdSelected: userProjectIds[0]
      })

      
    }
     
 

    const hardcodedProjectName = await contract.methods.getNameByProjectId(this.state.projectIdSelected).call();
    const decodedProjectName = web3.utils.toAscii(hardcodedProjectName);

    const commitMessagesById = await contract.methods.getCommitMessagesByProjectId(this.state.projectIdSelected).call();
    
    let projectCommits = commitMessagesById.map(c => web3.utils.toAscii(c));
  
    const commitTimestamps = await contract.methods.getCommitTimestampsByProjectId(this.state.projectIdSelected).call();

    const userData = await contract.methods.getUsernameByAddress(hardcodedUserAddress).call();
    const userName =  web3.utils.toAscii(userData);

    
    this.setState({
      projectName: decodedProjectName,
      projectNames: userProjectNames,
      projectId: userProjectIds,
      projectCommits,
      commitTimestamps,
      commitMessagesById,
      userName
    });


    contract.once('ProjectCreated', (err, result) => {
      console.log("** Project Created ** ", result)
    })

    contract.once('UserInvited', (err, result) => {
      console.log("** User Invited ** ", result)
    })

    contract.once('Commit', (err, result) => {
      console.log("** Code Committed ** ", result)
    })

    console.log("web3", await web3.eth.accounts.wallet)
  }
  
  onClickSelected = (projectSelected) => {
    this.setState=({
      projectSelected
    },() => {
      console.log("after",this.state.projectSelected);
  });
    this.getContractFeeds()
    // console.log("clicked")
    console.log("after after",this.state.projectSelected);

  }


  render() {
    let {
      projectName,
      projectId,
      projectNames,
      projectCommits,
      projectSelected,
      projectIdSelected,
      userName,
      commitTimestamps,
      commitMessagesById,
     } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    let projects = null;
    if(projectNames){
      projects = projectNames.map( (project, i) => {
        const selIndex = projectNames.indexOf(projectSelected)
        let id = projectId[i]

        return (
          <Card 
            className={"flex flex-center" + (id === this.state.projectIdSelected ? ' card-active' : ' card-inactive')} 
            onClick={() => {this.setState({projectSelected: project, projectIdSelected: id}); this.getContractFeeds()}}
            key={i}>
            <div>
              <p>
                {project} 
              </p>
            </div>
          </Card>
        )}
      )}


    return (
      <div className="App">
        <Navbar>
          <Container>
            <h3 className="logo">Code Hero</h3>
            <p className="lead">Welcome, {userName}</p>
          </Container>
        </Navbar>
          
        <Container className="main">
          <FormGroup >
            <Label className="text-left text-bold">Select Project</Label>
            <div className="flex project-list" >
              {projects}
            </div>
          </FormGroup>
          <div className="content">
            <ProjectData 
              selectedId={projectIdSelected} 
              name={projectName} 
              commits={projectCommits} dates={commitTimestamps}
              user={userName}
               />
          </div>
        </Container>
      </div>
    )

  }
}

export default App;
