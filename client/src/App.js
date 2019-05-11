import React, { Component } from "react";
import CodeHeroContract from "./contracts/Decentralize.json";
import {Container, Input, Label, FormGroup, Navbar, NavbarBrand} from 'reactstrap'
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
    const decodedProjectName = web3.utils.toAscii(hardcodedProjectName)
    console.log("Project Id 1 Name in hex format: ",decodedProjectName)

    const userProjectIds = await contract.methods.getProjectsByUserId(hardcodedUserAddress).call();
    console.log("userprojectIds", userProjectIds)

    const commitsById = await contract.methods.getCommitsByProjectId(hardcodedProjectId).call();
    console.log("commitsbyid", commitsById.map(c => web3.utils.toAscii(c)))
    let projectCommits = commitsById.map(c => web3.utils.toAscii(c));
    this.setState({
      projectName: decodedProjectName,
      projectId: userProjectIds,
      projectCommits
    });

    const commitMessages = await contract.methods.getCommitMessagesByProjectId(hardcodedProjectId).call();
    console.log("commitmessages", commitMessages)

    const commitTimestamps = await contract.methods.getCommitTimestampsByProjectId(hardcodedProjectId).call();
    console.log("timestamps", commitTimestamps)

    this.setState({
      projectName: decodedProjectName,
      projectId: userProjectIds,
      // projectCommits: commitsById
    })

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
      projectSelected
     } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    let projects = null;
    if(projectId){
      projects = projectId.map( (project, i) => {
        return <option key={i}>{project}</option>
      })
    }
  

    return (
      <div className="App">
        <Navbar>
          <h3>Code Hero</h3>
          <p className="lead">Welcome, User Name</p>
        </Navbar>
          
        <Container>
        <FormGroup style={{maxWidth: "400px"}}>
          <Label className="text-left">Select Project</Label>
          <Input 
              type="select" 
              name="projectSelected" 
              value={projectSelected} 
              onChange={this.handleChange}
              required>
               {projects}
            </Input>
        </FormGroup>
        

          <div className="content">
            <ProjectData name={projectName} commits={projectCommits}/>
          </div>
        </Container>
      </div>
    )

  }
}

export default App;
