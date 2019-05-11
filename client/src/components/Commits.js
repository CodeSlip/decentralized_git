import React from 'react';
import {Table} from 'reactstrap';


const ProjectInfo = (props) =>{
    let commits = null;
    if(props.commits){
        commits = this.props.commits.map(commit => {
            return(
                <tr>
                    <p>commit</p>
                </tr>
            )
        })
        
    }
  
    return(
        <div>
            <h4 className="repo-name">{props.name}</h4>

        </div>
    )

}

export default ProjectInfo;