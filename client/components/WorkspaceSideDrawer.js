import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom';

export const WorkspaceSideDrawer = (props) => {

  return (
    <div className="side-drawer">
      <ul>
        <li>Workspace 1</li>
        <li>Workspace 2</li>
      </ul>
    </div>
  );
}