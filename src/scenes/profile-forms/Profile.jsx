import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import { TextField } from "@mui/material";
import { CssTextField } from "./textfield";

export default function Profile(props) {
  const { state, dispatch, id } = props;
  const [desc, setDesc] = useState('');

  const [descArray, setDescArray] = useState([]);

  useEffect(() => {
    // console.log("hello");
    state.projects.map((obj) => {
      if (obj.id == id) {
        setDescArray(obj.desc);
      }
    })
  }, [state])
  
  // useEffect(() => {
  //   console.log(descArray);
  // },[descArray])

  return (
    <>
      <article className="bg-transparent p-5 rounded shadow shadow-emerald-300">
        <div className="flex items-center">
          <img
            src={props.owner.avatar_url}
            alt={props.owner.login}
            className="w-16 h-16 shadow rounded-full"
          />
          <ul className="ml-5">
            <li>
              <a href={`https://github.com/${props.owner.login}`} target="__blank" ><h2 className="font-bold sm:text-xl text-sm cursor-pointer">{props.owner.login}</h2></a>
            </li>
            <div>
              <p className="mr-2">{props.name}</p>
              {props.private ? (
                <p className="bg-rose-700 py-1 px-2 rounded-lg shadow text-white text-xs inline-block opacity-75">
                  Private
                </p>
              ) : (
                <p className="bg-emerald-700 py-1 px-2 rounded-lg shadow text-white text-xs inline-block opacity-75 mr-2">
                  Public
                </p>
              )}
            </div>
          </ul>
        </div>

        <div>
          <p className="mt-5">
            This repository was created on{" "}
            {format(new Date(props.created_at), "dd MMMM yyyy")} by{" "}
            {props.owner.login}
          </p>
          <div className="my-2 ">
            <form className={`${descArray.length>=5 && 'hidden'}`} onSubmit={(e) => { e.preventDefault(); dispatch({type : 'handle_project',payload : {id,desc}}); setDesc('')}}><CssTextField sx={{width : '80%'}} label="description" placeholder="type and press enter (write atmost 5)" value={desc} onChange={(e)=>setDesc(e.target.value)}/></form>
            <ul style={{ listStyleType: 'disc',paddingLeft : "1rem" }}>
              {
                descArray && descArray.map((obj, index) => (
                  <li key={index} className="text-base">{obj}</li>
                ))
              }
            </ul>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-right">
          <a
            className="underline text-sm"
            href={props.html_url}
            target="_blank"
            rel="noreferrer"
          >
            View Repo
          </a>
          <ul>
            <li>{props.stargazers_count.toLocaleString()} stars</li>
            <li>{props.watchers_count.toLocaleString()} Watchers</li>
          </ul>
        </div>

        <div className="flex items-center justify-between flex-wrap mt-5">
          <ul className="text-xs flex items-center justify-start">
            <li className="py-1 px-2 text-white bg-emerald-700 opacity-75 rounded-lg shadow inline-block mr-2">
              {props.language}
            </li>

            {props.topics &&
              props.topics.map((topic, index) => (
                <React.Fragment key={index}>
                  <li className="py-1 px-2 text-white bg-emerald-700 opacity-75 rounded-lg shadow inline-block mr-2">
                    {topic}
                  </li>
                </React.Fragment>
              ))}
          </ul>

          <p>{props.open_issues} issues</p>
        </div>
      </article>
    </>
  )
}