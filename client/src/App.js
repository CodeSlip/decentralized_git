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
      projectSelected: null };

    this.handleChange = this.handleChange.bind(this);   
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Rinkeby testnet
      const CodeHeroAddress = "0x409eA381663d17Bf44efdEf5c1DB4f10a69cA3c9";

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

  getContractFeeds = async() => {
    const { accounts, contract, web3 } = this.state;
    
    // Just so user address has data, until we assign this to eth.accounts[0] 
    const hardcodedUserAddress = "0xcC4c3FBfA2716D74B3ED6514ca8Ba99d7f941dF9"
    const hardcodedProjectId = "1";
    console.log("contract", contract)

    const hardcodedProjectName = await contract.methods.getNameByProjectId(hardcodedProjectId).call();
    const decodedProjectName = web3.utils.toAscii(hardcodedProjectName).trim();
    console.log("Project Id 1 Name in hex format: ",decodedProjectName)

    const userProjectIds = await contract.methods.getProjectsByUserId(hardcodedUserAddress).call();
    console.log("userprojectIds", userProjectIds)

    const commitMessagesById = await contract.methods.getCommitMessagesByProjectId(hardcodedProjectId).call();
    console.log("commitsbyid", commitMessagesById.map(c => web3.utils.toAscii(c)))

    
    let projectCommits = commitMessagesById.map(c => web3.utils.toAscii(c));
    console.log(projectCommits)
  

    const commitTimestamps = await contract.methods.getCommitTimestampsByProjectId(hardcodedProjectId).call();
    console.log("commitTimestamps", commitTimestamps)

    const userData = await contract.methods.getUsernameByAddress(hardcodedUserAddress).call();
    const userName =  web3.utils.toAscii(userData);


    this.setState({
      projectName: decodedProjectName,
      projectId: userProjectIds,
      projectCommits,
      commitTimestamps,
      commitMessagesById,
      userName,

    });

  }

  // Listen for input changes
  handleChange = (event) => {
    console.log("changed",event.target)
    this.setState({
      [event.target.name] : event.target.value
    })
  }


  render() {
    const {
      projectName,
      projectId,
      projectCommits,
      projectSelected,
      userName,
      commitTimestamps,
      commitMessagesById
     } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    let projects = null;
    if(projectId){
      projects = projectId.map( (project, i) => {
        return (
          <Card className="flex flex-center " key={i}>
            <div>
              <p>
                {project}
              </p>
            </div>
          </Card>)
      })
    }
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
            <div className="flex project-list">
              {projects}
            </div>
          </FormGroup>
          <div className="content">
            <ProjectData name={projectName} commits={projectCommits} dates={commitTimestamps} />
          </div>
        </Container>
      </div>
    )

  }
}

export default App;
