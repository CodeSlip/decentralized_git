import React, { Component } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
import CodeHeroContract from "./contracts/Decentralize.json";
import {Container} from 'reactstrap'
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Rinkeby testnet
      const CodeHeroAddress = "0xB5cd647158dC909f60Ad134c61EB1A28d561CFD8";
      // const simpleStorageAddress = "0x8143C17e682455CfADB88aa5E04A893261C6961C";

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

    this.setState({
      projectName: decodedProjectName,
      projectId: userProjectIds,
      projectCommits: commitsById
    })

  }

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  render() {
    const {
      projectName,
      projectId,
      projectCommits
     } = this.state;

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    // let commits = projectCommits.map( commit => {
    //   console.log(commit)
    //   return(
    //     <p></p>
    //   )
    // })

    return (
      <div className="App">
        <div className="header"><h3>Welcome, User Name</h3></div>
        <Container>
          <h4 className="repo-name">{projectName}</h4>
          <div className="content">
          </div>
  
        </Container>
      </div>
    )
    // return (
    //   <div className="App">
    //     <h1>Good to Go!</h1>
    //     <p>Your Truffle Box is installed and ready.</p>
    //     <h2>Smart Contract Example</h2>
    //     <p>
    //       If your contracts compiled and migrated successfully, below will show
    //       a stored value of 5 (by default).
    //     </p>
    //     <p>
    //       Try changing the value stored on <strong>line 40</strong> of App.js.
    //     </p>
    //     <div>The stored value is: {this.state.storageValue}</div>
    //   </div>
    // );
  }
}

export default App;
