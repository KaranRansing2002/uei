import React, { useContext } from 'react'
import { userContext } from '../../App'
import GitHubCalendar from 'react-github-calendar'

function Projects() {
    const { student } = useContext(userContext)
    const githubUserName = student.additionalInfo.github.split('https://github.com/')[1];

  return (
    <div>
      <GitHubCalendar username="grubersjoe" />
    </div>
  )
}
 
export default Projects
