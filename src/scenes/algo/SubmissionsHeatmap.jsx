import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const SubmissionHeatmap = ({ data , start,end }) => {
  const values = data;
    const startDate = start === undefined ? '2021-01-01' : start;
    const endDate = start === undefined ? '2022-01-01' : end;
  return (
    <div>
      <CalendarHeatmap
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        values={values}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          const count = Math.min(4, Math.ceil(value.count / 4));
          return `color-github-${count}`;
        }}
        titleForValue={(value) => {
          if (value) {
            return `${value.count} submissions on ${value.date}`;
          }
          return null;
        }}
        onClick={(value) => {
          if (value) {
            console.log("Clicked on", value.date);
          }
        }}
      />
    </div>
  );
};

export default SubmissionHeatmap;
