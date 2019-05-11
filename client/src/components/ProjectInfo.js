import React from 'react';
import {Table} from 'reactstrap';
import Blockies from 'react-blockies';


const ProjectInfo = (props) =>{
    let commits = null;
    let color = '#' + Math.floor(Math.random()*16777215).toString(16);
    let bgColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    let spotColor = '#' + Math.floor(Math.random()*16777215).toString(16);

    if(props.commits){
        commits = props.commits.map((commit, i) => {
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
                    <td>{commit}</td>
                    <td>description</td>
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
                        <th style={{width: "25%"}}>Commits</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {commits}
                </tbody>


            </Table>
        </div>
    )

}

export default ProjectInfo;