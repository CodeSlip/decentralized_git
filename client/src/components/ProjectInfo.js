import React from 'react';
import {Table} from 'reactstrap';
import Blockies from 'react-blockies';
import convertTime from '../utils/convertTime'
import ColoredLine from './ColoredLine';

import web3 from "web3";

const ProjectInfo = (props) =>{
    let commits = null;
    let color = '#' + Math.floor(Math.random()*16777215).toString(16);
    let bgColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    let spotColor = '#' + Math.floor(Math.random()*16777215).toString(16);

    let commitDate = null;

    if(props.dates){
        commitDate = props.dates.map( date => {
            return convertTime(date);
        })
    }
    
    
    if(props.commits ){
        console.log(props.commits);
        let commitsRev = props.commits.reverse()
        commits = commitsRev.map((commit, i) => {
            const id = web3.utils.fromAscii(commit).slice(7, 13);
            return(
                <tr key={i} className="commit-card">
                    <td>
                    <Blockies
                            seed="Jeremy" 
                            size={15} 
                            scale={3} 
                            color={color} 
                            bgColor={bgColor} 
                            spotColor={spotColor} 
                            className="identicon" 
                        />
                        <p className="text-center username">name</p>
                    </td>
                    <td>#{id}</td>
                    <td>{commit}</td>
                    <td>{commitDate[i]}</td>
                </tr>
            )
        })
    }
  
    return(
        <div>
            <h4 className="repo-name">{props.name}</h4>
            <br/>
            <Table>
                <thead>
                    <tr>
                        <th style={{width: "80px"}}>Users</th>
                        <th style={{width: "25%"}}>Commit</th>
                        <th>Description</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {commits}
                </tbody>
            </Table>
            <ColoredLine color='#fff'/>
        </div>
    )

}

export default ProjectInfo;