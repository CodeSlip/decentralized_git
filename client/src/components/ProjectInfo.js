import React from 'react';
import {Table} from 'reactstrap';


const ProjectInfo = (props) =>{
    let commits = null;
    if(props.commits){
        commits = props.commits.map(commit => {
            return(
                <tr>
                    <th>{commit}</th>
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
                        <th>Commits</th>
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