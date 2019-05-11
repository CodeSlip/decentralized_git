import React from 'react';
import {Table} from 'reactstrap';


const ProjectInfo = (props) =>{
    let commits = null;
    if(props.commits){
        commits = props.commits.map(commit => {
            return(
                <tr>
                    <td>users</td>
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