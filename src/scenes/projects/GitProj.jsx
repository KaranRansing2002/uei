import React, { useEffect, useState } from "react"
import { format } from "date-fns"


export default function GitProj(props) {
  
  // useEffect(() => {
  //   console.log(descArray);
  // },[descArray])
    
    const val = props.val;
    const desc = props.desc

  return (
    <>
      <article className="bg-transparent p-5 rounded shadow shadow-emerald-300">
        <div className="flex items-center">
          <img
            src={val.owner.avatar_url}
            alt={val.owner.login}
            className="w-16 h-16 shadow rounded-full"
          />
          <ul className="ml-5">
            <li>
              <a href={`https://github.com/${val.owner.login}`} target="__blank" ><h2 className="font-bold sm:text-xl text-sm cursor-pointer">{val.owner.login}</h2></a>
            </li>
            <div>
              <p className="mr-2">{val.name}</p>
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
            {format(new Date(val.created_at), "dd MMMM yyyy")} by{" "}
            {val.owner.login}
          </p>
          <div className="my-2 ">
            <ul style={{ listStyleType: 'disc',paddingLeft : "1rem" }}>
              {
                desc && desc.map((obj, index) => (
                  <li key={index} className="text-base">{obj}</li>
                ))
              }
            </ul>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-right">
          <a
            className="underline text-sm"
            href={val.html_url}
            target="_blank"
            rel="noreferrer"
          >
            View Repo
          </a>
          <ul>
            <li>{val.stargazers_count.toLocaleString()} stars</li>
            <li>{val.watchers_count.toLocaleString()} Watchers</li>
          </ul>
        </div>

        <div className="flex items-center justify-between flex-wrap mt-5">
          <ul className="text-xs flex items-center justify-start">
            <li className="py-1 px-2 text-white bg-emerald-700 opacity-75 rounded-lg shadow inline-block mr-2">
              {val.language}
            </li>

            {val.topics &&
              val.topics.map((topic, index) => (
                <React.Fragment key={index}>
                  <li className="py-1 px-2 text-white bg-emerald-700 opacity-75 rounded-lg shadow inline-block mr-2">
                    {topic}
                  </li>
                </React.Fragment>
              ))}
          </ul>

          <p>{val.open_issues} issues</p>
        </div>
      </article>
    </>
  )
}